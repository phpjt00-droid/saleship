import { TrendingUp } from 'lucide-react';
import { getTrendingDeals } from '@/lib/services/serverDealService';
import TrendingDealsClient from './TrendingDealsClient';

export default async function TrendingDealsSection() {
  const deals = await getTrendingDeals(5);

  return (
    <div className="bg-slate-50/50 dark:bg-slate-800/30 py-12">
      <div className="container">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              인기 핫딜
            </h2>
            <p className="text-sm text-slate-500 font-medium">지금 가격이 뜨겁거나 반응이 뜨겁게 나타나고 있는 추천 제품들</p>
          </div>
        </div>
        
        <TrendingDealsClient initialDeals={deals} />
      </div>
    </div>
  );
}
