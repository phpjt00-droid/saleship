'use client';

import { useDeals } from '@/features/deals/useDeals';
import { Deal } from '@/types/deal';
import DealCard from '@/components/DealCard';

interface TrendingDealsClientProps {
  initialDeals?: Deal[];
}

export default function TrendingDealsClient({ initialDeals = [] }: TrendingDealsClientProps) {
  const { trendingDeals: fetchedDeals, loading } = useDeals();
  const deals = fetchedDeals.length > 0 ? fetchedDeals : initialDeals;

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {deals.slice(0, 4).reverse().map(deal => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}
