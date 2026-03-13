import { createClient } from '@/lib/supabaseServer';
import { Deal } from '@/types/deal';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

/**
 * 서버 측에서 사용되는 중앙 집중식 핫딜 데이터 서비스입니다.
 * Next.js의 cache 및 revalidate 기능을 활용하여 성능을 최적화합니다.
 */

// 전체 딜 조회 (캐싱 적용)
export const getDeals = unstable_cache(
  async (page: number = 1, limit: number = 20): Promise<Deal[]> => {
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching deals:', error);
      throw new Error('데이터를 불러오는데 실패했습니다.');
    }

    return (data || []).map(mapDealData);
  },
  ['deals-list'],
  { revalidate: 60, tags: ['deals'] } // 60초마다 재검증
);

// 트렌딩 딜 조회 (캐싱 적용)
export const getTrendingDeals = unstable_cache(
  async (limit: number = 5): Promise<Deal[]> => {
    const supabase = await createClient();
    
    // 로직: 최근 24시간 내 좋아요가 많은 순 등 (여기서는 단순 상위 5개 예시)
    // 실제 정렬 로직은 dealUtils의 sortDeals와 유사하게 적용 가능
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('likes', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending deals:', error);
      throw new Error('트렌딩 데이터를 불러오는데 실패했습니다.');
    }

    return (data || []).map(mapDealData);
  },
  ['trending-deals'],
  { revalidate: 300, tags: ['deals', 'trending'] } // 5분마다 재검증
);

// 인기 딜 조회 (캐싱 적용)
export const getPopularDeals = unstable_cache(
  async (limit: number = 8): Promise<Deal[]> => {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching popular deals:', error);
      throw new Error('인기 데이터를 불러오는데 실패했습니다.');
    }

    return (data || []).map(mapDealData);
  },
  ['popular-deals'],
  { revalidate: 600, tags: ['deals', 'popular'] } // 10분마다 재검증
);

// 특정 딜 상세 조회 (단기 캐싱)
export const getDealById = cache(async (id: string | number): Promise<Deal | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  
  return mapDealData(data);
});

// 데이터 매핑 헬퍼
function mapDealData(deal: any): Deal {
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
}
