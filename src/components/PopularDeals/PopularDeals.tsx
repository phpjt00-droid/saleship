'use client'
import React from 'react'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import DealCard from '@/components/DealCard'
import { Deal } from '@/types/deal'

interface PopularDealsProps {
  deals: Deal[];
  userLikes: Set<any>;
  onLikeToggle: (e: any, id: number) => void;
}

export default function PopularDeals({ deals, userLikes, onLikeToggle }: PopularDealsProps) {
  return (
    <section className="section bg-white pt-12 pb-16">
      <div className="container">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl shadow-sm">
            <Flame size={20} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Today's Popular Deals</h2>
            <p className="text-sm font-bold text-slate-400">실시간 커뮤니티 인기 핫딜 Top 5</p>
          </div>
        </div>
        
        <div className="grid gap-4">
          {deals.map((deal, index) => (
            <div key={deal.id} className="relative group">
              {/* Rank Badge - 카드 외부 좌측에 배치하여 디자인 보존 */}
              <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl z-20 transition-transform group-hover:scale-110 shadow-lg
                ${index === 0 ? 'bg-orange-500 text-white shadow-orange-200' : 
                  index === 1 ? 'bg-slate-700 text-white shadow-slate-200' : 
                  index === 2 ? 'bg-orange-400 text-white shadow-orange-100' : 
                  'bg-white text-slate-400 border border-slate-100'}`}
              >
                {index + 1}
              </div>
              
              <div className="pl-6">
                <DealCard 
                  deal={deal}
                  viewMode="list"
                  isLiked={userLikes.has(deal.id.toString())}
                  isBookmarked={false} // PopularDeals에는 북마크 표시 없음
                  onLikeToggle={onLikeToggle}
                  onBookmarkToggle={() => {}} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
