import { supabase } from '@/lib/supabaseClient'
import { Deal } from '@/types/deal'
;
import { sortDeals as sortDealsUtil } from './dealUtils';

export const dealService = {
  /**
   * 전체 핫딜 목록을 가져옵니다. (페이지네이션 적용)
   */
  async getDeals(page: number = 1, limit: number = 20): Promise<Deal[]> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false })
      .range(from, to);

    if (postsError) throw postsError;

    const { data: likesData, error: likesError } = await supabase
      .from('post_likes')
      .select('post_id');

    const likeCounts = (likesData || []).reduce((acc: any, curr: any) => {
      acc[curr.post_id] = (acc[curr.post_id] || 0) + 1;
      return acc;
    }, {});

    return postsData.map(post => ({
      id: post.id,
      title: post.title,
      image: post.image,
      url: post.link || post.url || '',
      price: post.price_info?.currentPrice || post.currentPrice || '가격 확인',
      originalPrice: post.price_info?.originalPrice || post.originalPrice,
      discount: post.price_info?.discount || post.discount,
      store: post.store || '기타',
      shipping: post.shipping || '무료배송',
      likes: likeCounts[post.id.toString()] || post.likes || 0,
      comments: post.comments || 0,
      views: parseInt(post.views || '0', 10) || 0,
      createdAt: post.date || post.created_at,
      authorId: post.user_id || post.author_id || '',
      category: post.category,
      content: post.content,
      author: post.author || '세일쉽',
      avatar: post.avatar || '🐧'
    }));
  },

  async getDealById(id: string | number): Promise<Deal> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      image: data.image,
      url: data.link || data.url || '',
      price: data.price_info?.currentPrice || data.currentPrice || '가격 확인',
      originalPrice: data.price_info?.originalPrice || data.originalPrice,
      discount: data.price_info?.discount || data.discount,
      store: data.store || '기타',
      shipping: data.shipping || '무료배송',
      likes: data.likes || 0,
      comments: data.comments || 0,
      views: parseInt(data.views || '0', 10) || 0,
      createdAt: data.date || data.created_at,
      authorId: data.user_id || data.author_id || '',
      category: data.category,
      content: data.content,
      author: data.author || '세일쉽',
      avatar: data.avatar || '🐧'
    };
  },

  async getComments(postId: string | number) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * 실시간 인기순(점수 기반) Top 5 핫딜을 가져옵니다.
   */
  async getPopularDeals(): Promise<Deal[]> {
    const deals = await this.getDeals();
    return this.sortDeals(deals, 'popular').slice(0, 5);
  },

  /**
   * 핫딜 목록을 정렬합니다.
   */
  sortDeals(deals: Deal[], sortBy: string): Deal[] {
    return sortDealsUtil(deals, sortBy);
  }
};
