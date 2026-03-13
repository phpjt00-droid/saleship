import { supabase } from '@/lib/supabaseClient'
import { Deal, DealComment } from '@/types/deal'
import { sortDeals as sortDealsUtil } from './dealUtils';

export const dealService = {
  /**
   * 전체 핫딜 목록을 가져옵니다. (페이지네이션 적용)
   */
  async getDeals(page: number = 1, limit: number = 20): Promise<Deal[]> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 'posts' 테이블에서 최신순으로 가져오기
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return data.map(post => {
      const priceInfo = post.price_info || {};
      const parseNum = (val: any) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
          const num = parseInt(val.replace(/[^0-9]/g, ''));
          return isNaN(num) ? 0 : num;
        }
        return 0;
      };

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        store: post.store || '세일쉽',
        image: post.image || '',
        url: post.link || '',
        price: parseNum(priceInfo.currentPrice) || 0,
        originalPrice: parseNum(priceInfo.originalPrice) || 0,
        discount: parseNum(priceInfo.discount) || 0,
        likes: post.likes || 0,
        comments: post.comments || 0,
        views: parseNum(post.views) || 0,
        createdAt: post.created_at || post.date,
        authorId: post.user_id || '',
        shipping: '배송 정보 확인',
        author: '세일쉽',
        avatar: '🐧'
      };
    });
  },

  async getDealById(id: string | number): Promise<Deal> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return this._mapDealData(data);
  },

  /**
   * 슬러그를 통해 특정 핫딜 정보를 가져옵니다.
   */
  async getDealBySlug(slug: string): Promise<Deal> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return this._mapDealData(data);
  },

  /**
   * 핫딜의 조회수를 1 증가시킵니다.
   */
  async incrementViewCount(id: string | number) {
    // 주의: 실제 환경에서는 동시성 제어를 위해 RPC 기능을 사용하는 것이 좋습니다.
    // 여기서는 간단한 업데이트 로직을 구현합니다.
    const { data: current } = await supabase
      .from('deals')
      .select('views')
      .eq('id', id)
      .single();
    
    if (current) {
      await supabase
        .from('deals')
        .update({ views: (current.views || 0) + 1 })
        .eq('id', id);
    }
  },

  /**
   * 마이그레이션을 위한 데이터 매핑 헬퍼
   */
  _mapDealData(deal: any): Deal {
    return {
      id: deal.id,
      title: deal.title,
      subtitle: deal.subtitle,
      image: deal.image,
      url: deal.link || deal.url || '',
      price: Number(deal.price) || 0,
      originalPrice: Number(deal.original_price) || 0,
      discount: Number(deal.discount) || 0,
      store: deal.store || '세일쉽',
      shipping: deal.shipping || '무료배송',
      likes: deal.likes || 0,
      comments: deal.comments_count || deal.comments || 0,
      views: deal.views || 0,
      createdAt: deal.created_at,
      authorId: deal.user_id || '',
      category: deal.category,
      content: deal.content,
      author: deal.author || '세일쉽',
      avatar: deal.avatar || '🐧'
    };
  },

  async getComments(postId: string | number): Promise<DealComment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (nickname, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    return (data || []).map(comment => ({
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      user_name: comment.profiles?.nickname || '익명 사용자',
      user_avatar: comment.profiles?.avatar_url || '👤',
      content: comment.content,
      likes: comment.likes || 0,
      created_at: comment.created_at
    }));
  },

  /**
   * 새로운 댓글을 작성합니다.
   */
  async addComment(postId: string, content: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          user_id: userId,
          content: content,
          post_type: 'deal'
        }
      ]);

    if (error) throw error;
  },

  /**
   * 사용자의 투표를 등록하거나 변경합니다. (Upsert)
   */
  async vote(postId: string, userId: string, voteType: 'up' | 'down' | null): Promise<void> {
    if (voteType === null) {
      // 투표 취소
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      if (error) throw error;
      return;
    }

    const { error } = await supabase
      .from('votes')
      .upsert({
        post_id: postId,
        user_id: userId,
        vote_type: voteType,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'post_id,user_id'
      });

    if (error) throw error;
  },

  /**
   * 특정 게시물의 Up/Down 실시간 합계를 가져옵니다.
   */
  async getVoteCounts(postId: string): Promise<{ up: number, down: number }> {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('post_id', postId);

    if (error) throw error;

    const counts = (data || []).reduce((acc, curr) => {
      if (curr.vote_type === 'up') acc.up++;
      else if (curr.vote_type === 'down') acc.down++;
      return acc;
    }, { up: 0, down: 0 });

    return counts;
  },

  /**
   * 현재 사용자의 특정 게시물에 대한 투표 상태를 가져옵니다.
   */
  async getUserVote(postId: string, userId: string): Promise<'up' | 'down' | null> {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data?.vote_type || null;
  },

  /**
   * 새로운 핫딜을 등록합니다.
   */
  async createDeal(dealData: Partial<Deal>): Promise<{ id: string, slug: string }> {
    const baseSlug = encodeURIComponent(
      dealData.title?.slice(0, 20).replace(/\s+/g, '-') || 'deal'
    );
    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

    const { data, error } = await supabase
      .from('deals')
      .insert([
        {
          title: dealData.title,
          subtitle: dealData.subtitle,
          slug: slug,
          price: dealData.price,
          original_price: dealData.originalPrice,
          discount: dealData.discount,
          image: dealData.image,
          link: dealData.url,
          content: dealData.content,
          category: dealData.category,
          views: 0,
          likes: 0,
          created_at: new Date().toISOString()
        }
      ])
      .select('id, slug')
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * 실시간 트렌딩 핫딜을 가져옵니다. (점수 + 시간경과 반영)
   */
  async getTrendingDeals(limit: number = 5): Promise<Deal[]> {
    const deals = await this.getDeals(1, 50);
    return this.sortDeals(deals, 'trending').slice(0, limit);
  },

  /**
   * 누적 인기 핫딜을 가져옵니다. (순수 반응도 합계)
   */
  async getPopularDeals(limit: number = 8): Promise<Deal[]> {
    const deals = await this.getDeals(1, 100);
    return this.sortDeals(deals, 'popular').slice(0, limit);
  },

  /**
   * 최신 핫딜을 가져옵니다.
   */
  async getLatestDeals(limit: number = 12): Promise<Deal[]> {
    return await this.getDeals(1, limit);
  },

  /**
   * 핫딜 목록을 정렬합니다.
   */
  sortDeals(deals: Deal[], sortBy: string): Deal[] {
    return sortDealsUtil(deals, sortBy);
  }
};
