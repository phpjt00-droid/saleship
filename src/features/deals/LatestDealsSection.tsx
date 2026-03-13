import { getDeals } from '@/lib/services/serverDealService';
import LatestDealsClient from '@/app/LatestDealsClient';

/**
 * 서버 컴포넌트: 최신 핫딜 데이터를 직접 페칭하여
 * 클라이언트 컴포넌트에 초기 데이터로 전달합니다.
 */
export default async function LatestDealsSection() {
  // 데이터 페칭 (Suspense가 이 프로미스를 기다립니다)
  const initialDeals = await getDeals(1, 20);

  return <LatestDealsClient initialDeals={initialDeals} />;
}
