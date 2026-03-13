import { Trophy } from 'lucide-react';
import { getPopularDeals } from '@/lib/services/serverDealService';
import Link from 'next/link';

export default async function PopularDealsSidebar() {
  const popularDeals = await getPopularDeals(8);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 flex items-center gap-2">
          <span className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
            <Trophy size={20} />
          </span>
          인기 급상승
        </h2>
        <div className="flex flex-col gap-6">
          {popularDeals.map((deal, idx) => (
            <div key={deal.id} className="group cursor-pointer">
              <div className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-all group-hover:border-blue-200 dark:group-hover:border-blue-900">
                  <img 
                    src={deal.image} 
                    alt={deal.title} 
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-0 left-0 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-br-xl shadow-sm">
                    #{idx + 1}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-1.5 min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">
                    <Link href={`/deal/${deal.id}`}>{deal.title}</Link>
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider">
                    <span className="text-rose-500 font-black">{deal.discount}% OFF</span>
                    <span className="text-slate-400 dark:text-slate-500">{deal.price.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 사이드바 추가 위젯 공간 (예: 카테고리 바로가기 등) */}
        <div className="mt-12 p-6 rounded-3xl bg-blue-600 text-white relative overflow-hidden group shadow-xl shadow-blue-100 dark:shadow-none">
          <div className="relative z-10">
            <p className="text-xs font-bold opacity-80 mb-1 uppercase tracking-widest">New Feature</p>
            <h4 className="text-lg font-black leading-tight mb-4">나만의 맞춤 핫딜을<br />알림으로 받아보세요</h4>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-50 transition-colors shadow-lg">알림 설정하기</button>
          </div>
          <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 opacity-20 group-hover:rotate-12 transition-transform duration-700">
            <Trophy size={120} />
          </div>
        </div>
      </div>
    </div>
  );
}
