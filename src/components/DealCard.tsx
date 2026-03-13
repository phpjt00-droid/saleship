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
      className={`group relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 ${isList ? 'flex h-48' : 'flex flex-col h-full'}`}
    >
      {/* 이미지 섹션: 16:9 비율 고정 및 object-cover */}
      <div className={`relative bg-slate-100 dark:bg-slate-900 shrink-0 overflow-hidden aspect-video ${isList ? 'w-64 h-full' : 'w-full'}`}>
        <Image 
          src={deal.image} 
          alt={deal.title} 
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
          unoptimized={deal.image?.startsWith('http')}
          loading="lazy"
        />

        {/* 좌측 상단 배지들 */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {Number(deal.discount) > 0 && (
            <div className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-lg animate-in fade-in zoom-in">
              {deal.discount}% OFF
            </div>
          )}
          {isPopular && (
            <div className="bg-white/90 backdrop-blur-sm text-rose-500 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm border border-rose-100 flex items-center gap-1">
              🔥 HOT
            </div>
          )}
        </div>

        {/* 카테고리 배지 (우측 하단) */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="text-[10px] font-black tracking-wider text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md uppercase">
            {deal.category || 'DEAL'}
          </span>
        </div>
      </div>

      {/* 컨텐츠 섹션 */}
      <div className={`flex flex-col flex-1 p-5 md:p-6 ${isList ? 'justify-between min-w-0' : ''}`}>
        <div>
          <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-slate-400">
            <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
              {deal.brand_name || deal.store || 'Saleship'}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : '방금 전'}
            </span>
          </div>

          <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-4 text-base tracking-tight">
            {deal.title}
          </h3>
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl font-black text-rose-600 tracking-tighter">
              {Number(deal.price).toLocaleString()}원
            </span>
            {Number(deal.originalPrice) > 0 && (
              <div className="flex flex-col text-[10px] leading-none">
                <span className="text-slate-300 line-through font-medium">
                  {Number(deal.originalPrice).toLocaleString()}원
                </span>
                <span className="text-rose-500 font-extrabold mt-0.5 tracking-tighter">
                   {(100 - (Number(deal.price) / Number(deal.originalPrice) * 100)).toFixed(0)}% 파격세일
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold">
              <span className="flex items-center gap-1.5"><Eye size={14} /> {deal.views}</span>
              <span className="flex items-center gap-1.5 text-rose-500"><ThumbsUp size={14} /> {deal.likes}</span>
              <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {deal.comments}</span>
            </div>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBookmarkToggle?.(e, deal.id);
              }}
              className={`p-2.5 rounded-xl transition-all ${isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-inner' : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
