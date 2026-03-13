'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, Eye, Clock, ThumbsUp, ThumbsDown, Bookmark } from 'lucide-react'
import { Deal, DealViewMode } from '@/types/deal'

interface DealCardProps {
  deal: Deal;
  viewMode?: DealViewMode;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLikeToggle?: (e: any, id: string | number) => void;
  onBookmarkToggle?: (e: any, id: string | number) => void;
  searchQuery?: string;
}

export default function DealCard({ 
  deal, 
  viewMode = 'grid', 
  isLiked = false, 
  isBookmarked = false,
  onLikeToggle,
  onBookmarkToggle
}: DealCardProps) {
  const isList = viewMode === 'list';
  const isPopular = (Number(deal.likes) || 0) >= 10;

  return (
    <Link 
      href={`/deal/${deal.id}`}
      className={`group relative bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-all duration-500 hover:shadow-[0_42px_80px_-20px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_42px_80px_-20px_rgba(0,0,0,0.6)] hover:scale-[1.03] hover:-translate-y-2 ${isList ? 'flex h-48' : 'flex flex-col h-full'}`}
    >
      <div className={`relative bg-slate-50 dark:bg-slate-900 shrink-0 overflow-hidden ${isList ? 'w-60 h-full' : 'w-full h-56'}`}>
        <Image 
          src={deal.image} 
          alt={deal.title} 
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-6 transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110" 
          unoptimized={deal.image?.startsWith('http')}
          loading="lazy"
        />

        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {Number(deal.discount) > 0 && (
            <div className="bg-gradient-to-r from-[#FF4D00] to-[#FF8A00] text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xl shadow-orange-500/30 animate-in fade-in zoom-in duration-500">
              {deal.discount}% OFF
            </div>
          )}
          {isPopular && (
            <div className="bg-white dark:bg-slate-800 text-rose-500 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-1 animate-pulse">
              <span className="text-xs">🔥</span> POPULAR
            </div>
          )}
        </div>
      </div>

      <div className={`flex flex-col flex-1 p-6 md:p-8 ${isList ? 'justify-between min-w-0' : ''}`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl uppercase">
              {deal.brand_name || deal.store || '세일쉽'}
            </span>
            <span className="text-[10px] font-extrabold text-slate-400 flex items-center gap-1.5">
              <Clock size={12} className="opacity-70" /> {deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : '방금 전'}
            </span>
          </div>
          <h3 className="font-black text-slate-800 dark:text-slate-100 line-clamp-2 leading-[1.6] group-hover:text-emerald-600 transition-colors mb-4 text-lg tracking-tight">
            {deal.title}
          </h3>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
              {Number(deal.price).toLocaleString()}원
            </span>
            {Number(deal.originalPrice) > 0 && (
              <span className="text-sm font-bold text-slate-300 line-through decoration-rose-500/30">
                {Number(deal.originalPrice).toLocaleString()}원
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-800/50">
            <div className="flex items-center gap-5 text-[11px] text-slate-400 font-black tracking-wider">
              <span className="flex items-center gap-2 hover:text-slate-600 transition-colors"><Eye size={14} className="opacity-60" /> {deal.views}</span>
              <div className="flex items-center gap-2 transition-colors hover:text-emerald-500">
                <ThumbsUp size={14} className="opacity-60" />
                <span>{deal.likes}</span>
              </div>
              <span className="flex items-center gap-2 hover:text-blue-500 transition-colors"><MessageSquare size={14} className="opacity-60" /> {deal.comments}</span>
            </div>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBookmarkToggle?.(e, deal.id);
              }}
              className={`p-3 rounded-2xl transition-all duration-300 ${isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-inner' : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
