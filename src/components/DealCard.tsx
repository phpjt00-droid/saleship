'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Deal, DealViewMode } from '@/types/deal'
import { Heart, MessageCircle, Clock } from 'lucide-react'
import { useBookmarks } from '@/features/bookmarks/useBookmarks'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface DealCardProps {
  deal: Deal;
  viewMode?: DealViewMode;
}

export default function DealCard({ deal, viewMode = 'grid' }: DealCardProps) {
  const router = useRouter()
  const { toggleBookmark, isBookmarked } = useBookmarks()
  const { user } = useAuth()
  const bookmarked = isBookmarked(deal.id)

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('로그인이 필요한 서비스입니다.', {
        action: {
          label: '로그인하기',
          onClick: () => router.push('/login'),
        },
      });
      return;
    }

    toggleBookmark(deal);
  };

  const handleLogClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'deal_click', {
        item_name: deal.title,
        item_id: deal.id,
      });
    }
  };

  return (
    <div
      onClick={handleLogClick}
      className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* 썸네일 섹션 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 dark:bg-slate-800/50">
        <Link href={`/deals/${deal.id}`} className="block h-full">
          <img
            src={deal.thumbnail}
            alt={deal.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        <button
          onClick={handleBookmarkClick}
          className={`absolute top-6 right-6 p-3 rounded-2xl backdrop-blur-md transition-all active:scale-90 ${bookmarked
            ? 'bg-rose-500 text-white shadow-lg'
            : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500'
            }`}
        >
          <Heart size={20} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
        {deal.price_info?.discountRate && (
          <div className="absolute bottom-6 left-6 px-4 py-2 bg-rose-600 text-white text-xs font-black rounded-xl shadow-lg">
            {deal.price_info.discountRate} OFF
          </div>
        )}
      </div>

      {/* 정보 섹션 */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 rounded-lg uppercase tracking-widest">
            {deal.category}
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Clock size={12} /> Hot Now
          </span>
        </div>

        <Link href={`/deals/${deal.id}`} className="block mb-4">
          <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-2 leading-[1.3] group-hover:text-blue-600 transition-colors">
            {deal.title}
          </h3>
          <div className="text-sm font-bold text-slate-400">{deal.brand_name}</div>
        </Link>

        {/* 가격 및 액션 */}
        <div className="mt-auto pt-6 border-t dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900 dark:text-white">{deal.price_info?.currentPrice}</span>
            {deal.price_info?.originalPrice && (
              <span className="text-xs font-bold text-slate-400 line-through">{deal.price_info.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1.5 text-[11px] font-black">
              <MessageCircle size={14} /> 0
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-black">
              <Heart size={14} /> {deal.likes || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}