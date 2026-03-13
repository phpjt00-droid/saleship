import { Suspense } from 'react';
import Hero from '@/components/Hero/Hero';
import LatestDealsClient from './LatestDealsClient';
import TrendingDealsClient from '@/components/PopularDeals/TrendingDealsClient';
import PopularDealsSidebar from '@/components/PopularDeals/PopularDealsSidebar';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-20">
      <Hero />
      
      <div className="container mt-16 lg:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content: Latest & Trending */}
          <div className="lg:col-span-2 space-y-20">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-600 rounded-full" />
                  최신 핫딜
                </h2>
              </div>
              <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" /><div className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" /></div>}>
                <LatestDealsClient />
              </Suspense>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <span className="w-2 h-8 bg-rose-500 rounded-full" />
                  인기 급상승
                </h2>
              </div>
              <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" /><div className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" /></div>}>
                <TrendingDealsClient />
              </Suspense>
            </section>
          </div>

          {/* Sidebar: Popular Board */}
          <aside className="space-y-8">
            <div className="sticky top-24">
              <Suspense fallback={<div className="h-[600px] bg-slate-100 animate-pulse rounded-[2.5rem]" />}>
                <PopularDealsSidebar />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
