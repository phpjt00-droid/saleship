'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, Eye, MapPin, Clock, ThumbsUp, Bookmark } from 'lucide-react'
import HighlightText from '../HighlightText/HighlightText'

import { parsePrice } from '@/features/deals/dealUtils'
import { Deal } from '@/features/deals/dealTypes'

export default function HotDealCard({ 
  deal, 
  searchQuery = '', 
  isLiked, 
  isBookmarked, 
  onLikeToggle, 
  onBookmarkToggle,
  viewMode = 'grid',
  index = 0
}: {
  deal: Deal;
  searchQuery?: string;
  isLiked: boolean;
  isBookmarked: boolean;
  onLikeToggle: (e: any, id: number) => void;
  onBookmarkToggle: (e: any, id: number) => void;
  viewMode?: 'grid' | 'list';
  index?: number;
}) {
  const isHot = ((deal.likes || 0) > 30) || (deal.comments > 20) || (parsePrice(deal.views) > 1000);
  const isList = viewMode === 'list';

  return (
    <Link 
      href={`/deals/${deal.id}`} 
      className={`animate-fadeInUp group relative block bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.015] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-orange-200 dark:hover:border-orange-900/40 ${isList ? 'flex flex-row h-40' : 'flex flex-col h-full'}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-slate-50 dark:bg-slate-800/80 shrink-0 ${isList ? 'w-48 h-full' : 'w-full h-56'}`}>
        <Image 
          src={deal.image} 
          alt={deal.title} 
          fill
          sizes={isList ? "200px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
          unoptimized={deal.image?.startsWith('http')}
        />
        
        {/* Discount Badge */}
        {deal.discount && (
          <div className={`absolute left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 transition-transform group-hover:scale-110 ${isList ? 'bottom-3' : 'top-3'}`}>
            {deal.discount}
          </div>
        )}

        {/* Bookmark Button (Only for Grid) */}
        {!isList && (
          <button 
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${isBookmarked ? 'bg-amber-400 text-white' : 'bg-slate-900/40 text-white hover:bg-slate-900/60'}`}
            onClick={(e) => onBookmarkToggle(e, deal.id)}
          >
            <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className={`flex flex-col flex-1 ${isList ? 'p-4 justify-between' : 'p-6'}`}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded uppercase border border-slate-200 dark:border-slate-700">{deal.store}</span>
              <span className="text-[10px] font-medium text-slate-400">{deal.shipping}</span>
            </div>
            {isList ? (
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} />{deal.createdAt}</span>
                <button 
                  className={`p-1.5 rounded-full transition-all ${isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}
                  onClick={(e) => onBookmarkToggle(e, deal.id)}
                >
                  <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
                </button>
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} />{deal.createdAt}</span>
            )}
          </div>

          <h3 className={`font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors ${isList ? 'text-sm mb-2' : 'text-base mb-4 h-12 flex items-center gap-2'}`}>
            {!isList && isHot && (
              <span className="shrink-0 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded leading-none animate-pulse">
                HOT
              </span>
            )}
            <HighlightText text={deal.title} query={searchQuery} />
          </h3>
        </div>

        <div className={!isList ? "mt-auto" : ""}>
          {/* Price Section */}
          <div className={`flex items-baseline gap-1.5 ${isList ? 'mb-2' : 'mb-4'}`}>
            <span className={`${isList ? 'text-lg' : 'text-xl'} font-black text-slate-900 dark:text-white`}>
              {deal.price}
            </span>
            {deal.originalPrice && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-600">
                {deal.originalPrice}
              </span>
            )}
          </div>

          {/* Stats & Actions */}
          <div className={`flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50`}>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="text-sm">{deal.avatar}</span>
              <span className="truncate max-w-[80px]">{deal.author}</span>
            </div>
            
            <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-bold">
              <span className="flex items-center gap-1.5"><Eye size={12} />{deal.views?.toLocaleString() || 0}</span>
              <button 
                className={`flex items-center gap-1.5 transition-colors hover:text-blue-500 ${isLiked ? 'text-blue-500' : ''}`}
                onClick={(e) => onLikeToggle(e, deal.id)}
              >
                <ThumbsUp size={12} fill={isLiked ? "currentColor" : "none"} />
                {deal.likes?.toLocaleString() || 0}
              </button>
              <span className="flex items-center gap-1.5 group-hover:text-slate-600 transition-colors">
                <MessageSquare size={12} /> 
                {deal.comments?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
