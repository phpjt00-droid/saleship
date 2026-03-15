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
        store: post.store || 'Saleship',
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
        author: 'Saleship',
        avatar: '/images/pingu-hello.png',
        brand_name: post.brand_name || post.store || '',
        deal_link: post.link || post.url || '',
        promo_code: post.promo_code || '',
        end_date: post.end_date,
        upvote_count: post.upvote_count || post.likes || 0,
        summary: post.summary || ''
      };
    });
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

  _mapDealData(post: any): Deal {
    return {
      id: post.id, title: post.title, subtitle: post.subtitle, image: post.image,
      url: post.link || post.url || '', price: Number(post.price) || 0,
      originalPrice: Number(post.original_price) || 0, discount: Number(post.discount) || 0,
      store: post.store || 'Saleship', shipping: post.shipping || '무료배송',
      likes: post.likes || 0, comments: post.comments_count || post.comments || 0,
      views: post.views || 0, createdAt: post.created_at, authorId: post.user_id || '',
      category: post.category, content: post.content, author: post.author || 'Saleship',
      avatar: post.avatar || '/images/pingu-hello.png', summary: post.summary || ''
    };
  },
  // ... (나머지 getComments, vote 등 기존 로직 동일)
};