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

  return (
    <Link 
      href={`/deal/${deal.id}`}
      className={`group relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,_0,_0,_0.3)] hover:-translate-y-1.5 ${isList ? 'flex h-44' : 'flex flex-col h-full'}`}
    >
      <div className={`relative bg-slate-50 dark:bg-slate-900 shrink-0 overflow-hidden ${isList ? 'w-52 h-full' : 'w-full h-56'}`}>
        <Image 
          src={deal.image} 
          alt={deal.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-110" 
          unoptimized={deal.image?.startsWith('http')}
        />

        {Number(deal.discount) > 0 && (
          <div className="absolute top-4 left-4 bg-gradient-to-br from-rose-500 to-orange-600 text-white text-[11px] font-black px-3 py-1 rounded-xl shadow-lg shadow-rose-200 dark:shadow-none z-10">
            {deal.discount}% OFF
          </div>
        )}
      </div>

      <div className={`flex flex-col flex-1 p-5 md:p-6 ${isList ? 'justify-between min-w-0' : ''}`}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg uppercase">
              {deal.store || '세일쉽'}
            </span>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <Clock size={12} className="opacity-70" /> {deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : '방금 전'}
            </span>
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors mb-3 text-base">
            {deal.title}
          </h3>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {Number(deal.price).toLocaleString()}원
            </span>
            {Number(deal.originalPrice) > 0 && (
              <span className="text-xs font-bold text-slate-300 line-through">
                {Number(deal.originalPrice).toLocaleString()}원
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/30">
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-black">
              <span className="flex items-center gap-1.5 hover:text-slate-600 transition-colors"><Eye size={14} className="opacity-70" /> {deal.views}</span>
              <div className="flex items-center gap-1.5 transition-colors hover:text-rose-500">
                <ThumbsUp size={14} className="opacity-70" />
                <span>{deal.likes}</span>
              </div>
              <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><MessageSquare size={14} className="opacity-70" /> {deal.comments}</span>
            </div>
            
            <button 
              onClick={(e) => onBookmarkToggle?.(e, deal.id)}
              className={`p-2 rounded-xl transition-all duration-300 ${isBookmarked ? 'text-amber-500 bg-amber-50 shadow-inner' : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50'}`}
            >
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
