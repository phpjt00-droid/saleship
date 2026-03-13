import { Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import { getDeals } from '@/lib/services/serverDealService';
import Hero from '@/components/Hero/Hero';
import TrendingDealsSection from '@/components/PopularDeals/TrendingDealsSection';
import PopularDealsSidebar from '@/components/PopularDeals/PopularDealsSidebar';
import DealGridSkeleton from '@/components/DealList/DealGridSkeleton';
import LatestDealsClient from '@/app/LatestDealsClient';

/**
 * 핫딜 메인 페이지 (서버 컴포넌트)
 * 중앙 집중식 데이터 페칭, 캐싱, 및 Suspense를 활용한 고성능 레이아웃을 제공합니다.
 */
export default async function Home() {
  // 초기 핫딜 데이터 조회
  const initialDeals = await getDeals(1, 20);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      {/* 0. 프리미엄 Hero 섹션 */}
      <Hero />

      {/* 1. 상단 트렌딩 섹션 (Suspense 적용) */}
      <Suspense fallback={
        <div className="bg-slate-50/50 dark:bg-slate-800/30 py-12">
          <div className="container">
            <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-10 animate-pulse"></div>
            <DealGridSkeleton count={5} />
          </div>
        </div>
      }>
        <TrendingDealsSection />
      </Suspense>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* 2. 최신 핫딜 피드 (메인 좌측 2/3) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-10 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    최신 핫딜 피드
                  </h2>
                  <p className="text-sm text-slate-500 font-medium whitespace-nowrap">방금 올라온 따끈따끈한 세일 정보</p>
                </div>
              </div>
            </div>
            
            <LatestDealsClient initialDeals={initialDeals} />
          </div>

          {/* 3. 인기 핫딜 사이드바 (우측 1/3, Suspense 적용) */}
          <Suspense fallback={
            <div className="lg:col-span-1">
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-8 animate-pulse"></div>
              <div className="flex flex-col gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                    <div className="flex-1 py-2">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full mb-2"></div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }>
            <PopularDealsSidebar />
          </Suspense>
          
        </div>
      </div>
    </main>
  );
}
