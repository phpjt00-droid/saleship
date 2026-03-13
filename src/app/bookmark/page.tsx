'use client'
import React from 'react'
import { useBookmarks } from '@/features/bookmarks/useBookmarks'
import DealCard from '@/components/DealCard'
import { Bookmark, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function BookmarkPage() {
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks()

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 pb-24">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 pt-32 pb-16">
        <div className="container">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-2xl flex items-center justify-center shadow-sm">
              <Bookmark size={28} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">내 북마크</h1>
              <p className="text-slate-500 font-medium mt-1">저장하신 보물같은 핫딜들을 모아봤어요 🐧</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {bookmarks.map(deal => (
              <DealCard 
                key={deal.id} 
                deal={deal} 
                isBookmarked={true}
                onBookmarkToggle={(e) => {
                  e.preventDefault();
                  toggleBookmark(deal);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShoppingBag size={40} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3">북마크가 비어있어요</h2>
            <p className="text-slate-400 font-medium mb-10 leading-relaxed">
              마음에 드는 핫딜을 발견하면<br />
              북마크 버튼을 눌러 나중에 다시 확인하세요!
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-8 h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95"
            >
              핫딜 구경하러 가기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
