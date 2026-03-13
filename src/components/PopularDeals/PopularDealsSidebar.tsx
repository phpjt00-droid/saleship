'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Deal } from '@/types/deal';
import { Award, ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function PopularDealsSidebar() {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    async function fetchPopular() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('views', { ascending: false })
        .limit(10);
      setDeals(data || []);
    }
    fetchPopular();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100">
          <Award className="text-white" size={20} />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">인기 베스트</h3>
      </div>

      <div className="space-y-6">
        {deals.map((deal, idx) => (
          <Link 
            key={deal.id} 
            href={`/deals/${deal.id}`}
            className="flex items-center gap-4 group"
          >
            <div className="text-lg font-black text-slate-300 group-hover:text-blue-600 transition-colors w-6">
              {String(idx + 1).padStart(2, '0')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-slate-900 dark:text-white truncate mb-1 group-hover:underline">
                {deal.title}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-rose-500">{deal.brand_name}</span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <TrendingUp size={10} /> {deal.views || 0}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link 
        href="/deals?sort=popular" 
        className="mt-10 w-full h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center gap-2 text-sm font-black text-slate-500 hover:bg-slate-100 transition-all"
      >
        전체 보기 <ChevronRight size={16} />
      </Link>
    </div>
  );
}
