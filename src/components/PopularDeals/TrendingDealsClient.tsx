'use client';

import { useDeals } from '@/features/deals/useDeals';
import DealCard from '@/components/DealCard';
import { Deal } from '@/types/deal';

interface TrendingDealsClientProps {
  initialDeals: Deal[];
}

export default function TrendingDealsClient({ initialDeals }: TrendingDealsClientProps) {
  const { userLikes, handleLikeToggle } = useDeals();
  
  // 서버에서 받은 초기 데이터 사용
  const deals = initialDeals.length > 0 ? initialDeals : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {deals.map((deal, index) => (
        <div key={deal.id} className="relative group">
          <div className={`absolute -left-2 -top-2 w-10 h-10 flex items-center justify-center rounded-2xl font-black text-lg z-20 transition-transform group-hover:scale-110 shadow-lg
            ${index === 0 ? 'bg-rose-500 text-white shadow-rose-200' : 
              index === 1 ? 'bg-orange-500 text-white shadow-orange-200' : 
              index === 2 ? 'bg-amber-500 text-white shadow-amber-200' : 
              'bg-white text-slate-400 border border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}
          >
            {index + 1}
          </div>
          
          <DealCard 
            deal={deal}
            viewMode="grid"
            isLiked={userLikes.has(deal.id.toString())}
            isBookmarked={false}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={() => {}} 
          />
        </div>
      ))}
    </div>
  );
}
