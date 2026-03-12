'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, Eye, MapPin } from 'lucide-react'
import HighlightText from './HighlightText'
import DealActions from './DealActions'

export default function HotDealCard({ 
  deal, 
  searchQuery = '', 
  isLiked, 
  isBookmarked, 
  onLikeToggle, 
  onBookmarkToggle 
}) {
  return (
    <Link 
      href={`/post/${deal.id}`} 
      className="animate-fadeInUp group relative block h-full flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.025] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] hover:border-orange-200 dark:hover:border-orange-900/40"
    >
      {/* Image Container */}
      <div className="relative w-full h-56 overflow-hidden bg-slate-50 dark:bg-slate-800/80 shrink-0">
        <Image 
          src={deal.image} 
          alt={deal.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
          unoptimized={deal.image?.startsWith('http')}
        />
        
        {/* Discount Badge (Top-Left) */}
        {deal.discount && (
          <div className="absolute top-4 left-4 bg-orange-600 dark:bg-orange-500 text-white text-[12px] font-black px-3 py-1.5 rounded-xl shadow-lg z-10 animate-pulse">
            {deal.discount}
          </div>
        )}
        
        {/* Subtle Overlay gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
           {/* Store Badge */}
           <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400 px-2.5 py-1 rounded-lg uppercase border border-orange-100 dark:border-orange-900/30 shadow-sm transition-colors group-hover:bg-orange-100">
             {deal.store}
           </span>
           {/* Shipping Info */}
           <span className="text-[11px] font-bold text-slate-400 ml-auto flex items-center gap-1.5">
             <MapPin size={12} className="text-slate-300" />
             {deal.shipping}
           </span>
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2 mb-4 leading-snug group-hover:text-orange-600 transition-colors h-12">
          <HighlightText text={deal.title} query={searchQuery} />
        </h3>

        <div className="mt-auto">
          {/* Price Section */}
          <div className="flex flex-col gap-0.5 mb-5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-orange-600 transition-colors">
                {deal.currentPrice}
              </span>
              {deal.originalPrice && (
                <span className="text-sm font-medium text-slate-300 dark:text-slate-500 line-through decoration-slate-200 dark:decoration-slate-600">
                  {deal.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Actions & Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50 text-[11px] text-slate-400 dark:text-slate-500 font-bold">
            <DealActions 
              postId={deal.id}
              upvotes={deal.upvotes}
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              onLikeToggle={onLikeToggle}
              onBookmarkToggle={onBookmarkToggle}
            />
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 group-hover:text-slate-600 transition-colors">
                <MessageSquare size={13} className="text-slate-300" /> 
                {deal.comments?.toLocaleString() || 0}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={13} className="text-slate-300" /> 
                {typeof deal.views === 'number' ? deal.views.toLocaleString() : deal.views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
