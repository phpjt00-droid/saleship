import { supabase } from '@/lib/supabaseClient'
import { Deal, DealComment } from '@/types/deal'
import { sortDeals as sortDealsUtil } from './dealUtils';

export const dealService = {
  async getDeals({ page = 1, limit = 20, category, sort = 'latest', query: search }: {
    page?: number; limit?: number; category?: string; sort?: string; query?: string;
  } = {}): Promise<Deal[]> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('posts').select('*');

    if (category && category !== 'all') query = query.eq('category', category);
    if (search) query = query.ilike('title', `%${search}%`);
    if (sort === 'popular') query = query.order('views', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data, error } = await query.range(from, to);
    if (error) throw error;

    return (data || []).map((post: any) => this._mapDealData(post));
  },

  async getDealById(id: string | number): Promise<Deal> {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) throw error;
    return this._mapDealData(data);
  },

  async getDealBySlug(slug: string): Promise<Deal> {
    const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();
    if (error) throw error;
    return this._mapDealData(data);
  },

  async incrementViewCount(id: string | number) {
    const { data: current } = await supabase.from('posts').select('views').eq('id', id).single();
    if (current) {
      await supabase.from('posts').update({ views: (current.views || 0) + 1 }).eq('id', id);
    }
  },

  async createDeal(dealData: Partial<Deal>): Promise<{ id: string, slug: string }> {
    const baseSlug = encodeURIComponent(dealData.title?.slice(0, 20).replace(/\s+/g, '-') || 'deal');
    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        title: dealData.title, subtitle: dealData.subtitle, slug, price: dealData.price,
        original_price: dealData.originalPrice, discount: dealData.discount, image: dealData.image,
        link: dealData.url, content: dealData.content, category: dealData.category,
        views: 0, likes: 0, created_at: new Date().toISOString()
      }])
      .select('id, slug').single();
    if (error) throw error;
    return data;
  },

  async getTrendingDeals(limit: number = 5): Promise<Deal[]> {
    const deals = await this.getDeals({ limit: 50 });
    return this.sortDeals(deals, 'trending').slice(0, limit);
  },

  async getPopularDeals(limit: number = 8): Promise<Deal[]> {
    const deals = await this.getDeals({ limit: 100 });
    return this.sortDeals(deals, 'popular').slice(0, limit);
  },

  async getLatestDeals(limit: number = 12): Promise<Deal[]> {
    return await this.getDeals({ limit });
  },

  sortDeals(deals: Deal[], sortBy: string): Deal[] {
    return sortDealsUtil(deals, sortBy);
  },

  _mapDealData(post: any): Deal {
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
      id: post.id, title: post.title, subtitle: post.subtitle, image: post.image,
      url: post.link || post.url || '', price: parseNum(priceInfo.currentPrice) || Number(post.price) || 0,
      originalPrice: parseNum(priceInfo.originalPrice) || Number(post.original_price) || 0,
      discount: parseNum(priceInfo.discount) || Number(post.discount) || 0,
      store: post.store || 'Saleship', shipping: post.shipping || '무료배송',
      likes: post.likes || 0, comments: post.comments_count || post.comments || 0,
      views: parseNum(post.views) || 0, createdAt: post.created_at, authorId: post.user_id || '',
      category: post.category, content: post.content, author: post.author || 'Saleship',
      avatar: post.avatar || '/images/pingu-hello.png', summary: post.summary || ''
    };
  },

  async getComments(postId: string | number): Promise<DealComment[]> {
    const { data, error } = await supabase.from('comments').select('*, profiles:user_id (nickname, avatar_url)').eq('post_id', postId).order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(c => ({ id: c.id, post_id: c.post_id, user_id: c.user_id, user_name: c.profiles?.nickname, user_avatar: c.profiles?.avatar_url, content: c.content, likes: c.likes || 0, created_at: c.created_at }));
  },

  async addComment(postId: string, content: string, userId: string): Promise<void> {
    const { error } = await supabase.from('comments').insert([{ post_id: postId, user_id: userId, content, post_type: 'deal' }]);
    if (error) throw error;
  },

  async vote(postId: string, userId: string, voteType: 'up' | 'down' | null): Promise<void> {
    if (voteType === null) { await supabase.from('votes').delete().eq('post_id', postId).eq('user_id', userId); return; }
    const { error } = await supabase.from('votes').upsert({ post_id: postId, user_id: userId, vote_type: voteType, created_at: new Date().toISOString() }, { onConflict: 'post_id,user_id' });
    if (error) throw error;
  },

  async getVoteCounts(postId: string): Promise<{ up: number, down: number }> {
    const { data } = await supabase.from('votes').select('vote_type').eq('post_id', postId);
    return (data || []).reduce((acc, curr) => { if (curr.vote_type === 'up') acc.up++; else if (curr.vote_type === 'down') acc.down++; return acc; }, { up: 0, down: 0 });
  },

  async getUserVote(postId: string, userId: string): Promise<'up' | 'down' | null> {
    const { data } = await supabase.from('votes').select('vote_type').eq('post_id', postId).eq('user_id', userId).maybeSingle();
    return data?.vote_type || null;
  }
};