'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, Eye, Clock, ThumbsUp, Bookmark } from 'lucide-react'
import { Deal, DealViewMode } from '@/types/deal'

interface DealCardProps {
  deal: Deal;
  viewMode?: DealViewMode;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLikeToggle?: (e: any, id: number) => void;
  onBookmarkToggle?: (e: any, id: number) => void;
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
      className={`group relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isList ? 'flex h-40' : 'flex flex-col h-full'}`}
    >
      <div className={`relative bg-slate-50 dark:bg-slate-900 shrink-0 ${isList ? 'w-48 h-full' : 'w-full h-52'}`}>
        <Image 
          src={deal.image} 
          alt={deal.title} 
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
          unoptimized={deal.image?.startsWith('http')}
        />
        {deal.discount && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
            {deal.discount}%
          </div>
        )}
      </div>

      <div className={`flex flex-col flex-1 p-4 md:p-6 ${isList ? 'justify-between' : ''}`}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase">
              {deal.store}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock size={10} /> {deal.createdAt}
            </span>
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors mb-2">
            {deal.title}
          </h3>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {Number(deal.price).toLocaleString()}원
            </span>
            {Number(deal.originalPrice) > 0 && (
              <span className="text-xs text-slate-400 line-through">
                {Number(deal.originalPrice).toLocaleString()}원
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50">
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold">
              <span className="flex items-center gap-1.5"><Eye size={12} /> {deal.views}</span>
              <button 
                onClick={(e) => onLikeToggle?.(e, deal.id)}
                className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
              >
                <ThumbsUp size={12} fill={isLiked ? "currentColor" : "none"} /> {deal.likes}
              </button>
              <span className="flex items-center gap-1.5 cursor-default"><MessageSquare size={12} /> {deal.comments}</span>
            </div>
            
            <button 
              onClick={(e) => onBookmarkToggle?.(e, deal.id)}
              className={`p-1.5 rounded-full transition-colors ${isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50'}`}
            >
              <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
