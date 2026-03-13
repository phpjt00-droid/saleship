import { createClient } from '@/lib/supabaseServer';
import { Deal } from '@/types/deal';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

/**
 * 서버 측에서 사용되는 중앙 집중식 핫딜 데이터 서비스입니다.
 * Next.js의 cache 및 revalidate 기능을 활용하여 성능을 최적화합니다.
 */

// 전체 딜 조회 (캐싱 적용 + 카테고리 필터링 + 정렬)
export const getDeals = (page: number = 1, limit: number = 20, category?: string, sort: string = 'latest'): Promise<Deal[]> => {
  return unstable_cache(
    async (): Promise<Deal[]> => {
      const supabase = await createClient();
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('posts')
        .select('*');

      if (category) {
        query = query.eq('category', category);
      }

      if (sort === 'popular') {
        query = query.order('views', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.range(from, to);

      if (error) {
        console.error('Error fetching deals:', error);
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }

      return (data || []).map(mapPostToDeal);
    },
    [`deals-list-${category || 'all'}-${sort}-${page}`],
    { revalidate: 60, tags: ['deals', category ? `deals-${category}` : 'deals-all'] }
  )();
};

// 트렌딩 딜 조회 (캐싱 적용)
export const getTrendingDeals = unstable_cache(
  async (limit: number = 5): Promise<Deal[]> => {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('likes', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending deals:', error);
      throw new Error('트렌딩 데이터를 불러오는데 실패했습니다.');
    }

    return (data || []).map(mapPostToDeal);
  },
  ['trending-deals'],
  { revalidate: 300, tags: ['deals', 'trending'] }
);

// 인기 딜 조회 (캐싱 적용)
export const getPopularDeals = unstable_cache(
  async (limit: number = 8): Promise<Deal[]> => {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching popular deals:', error);
      throw new Error('인기 데이터를 불러오는데 실패했습니다.');
    }

    return (data || []).map(mapPostToDeal);
  },
  ['popular-deals'],
  { revalidate: 600, tags: ['deals', 'popular'] }
);

// 특정 딜 상세 조회 (단기 캐싱)
export const getDealById = cache(async (id: string | number): Promise<Deal | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return mapPostToDeal(data);
});

// 데이터 매핑 헬퍼: posts 테이블 스키마를 Deal 타입으로 변환
function mapPostToDeal(post: any): Deal {
  const priceInfo = post.price_info || {};
  
  // 숫자 추출 도우미 (예: "15,000원" -> 15000)
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
    avatar: '/images/mascot.png',
    // 확장 필드 매핑
    brand_name: post.brand_name || post.store || '',
    deal_link: post.link || post.url || '',
    promo_code: post.promo_code || '',
    end_date: post.end_date,
    upvote_count: post.upvote_count || post.likes || 0
  };
}
