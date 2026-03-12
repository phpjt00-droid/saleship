'use client'
import React from 'react'
import Link from 'next/link'
import { Flame, MessageSquare, ThumbsUp } from 'lucide-react'
import DealActions from './DealActions'

export default function PopularDeals({ 
  deals, 
  userLikes, 
  onLikeToggle 
}) {
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
            <Link 
              key={deal.id} 
              href={`/post/${deal.id}`}
              className="flex items-center gap-4 p-4 md:p-6 bg-slate-50 hover:bg-white hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] hover:border-orange-100 border border-transparent rounded-3xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Rank Badge */}
              <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl transition-transform group-hover:scale-110 shadow-sm
                ${index === 0 ? 'bg-orange-500 text-white shadow-orange-200' : 
                  index === 1 ? 'bg-slate-700 text-white shadow-slate-200' : 
                  index === 2 ? 'bg-orange-400 text-white shadow-orange-100' : 
                  'bg-white text-slate-400 border border-slate-100'}`}
              >
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100 uppercase tracking-tighter">
                      {deal.store}
                    </span>
                    {deal.discount && (
                      <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                        {deal.discount}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base md:text-lg font-extrabold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {deal.title}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-8 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">{deal.currentPrice}</span>
                    {deal.originalPrice && (
                      <span className="text-[11px] text-slate-300 line-through font-medium leading-none">{deal.originalPrice}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-5 pr-2">
                    <div 
                      className="flex items-center gap-1.5 text-slate-400 group-hover:text-blue-500 transition-colors"
                      onClick={(e) => onLikeToggle(e, deal.id)}
                    >
                      <ThumbsUp size={16} fill={userLikes.has(deal.id.toString()) ? "currentColor" : "none"} className={userLikes.has(deal.id.toString()) ? 'text-blue-500' : ''} />
                      <span className="text-xs font-black">{deal.upvotes + (userLikes.has(deal.id.toString()) ? 1 : 0)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-600 transition-colors">
                      <MessageSquare size={16} />
                      <span className="text-xs font-black">{deal.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
