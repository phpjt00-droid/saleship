'use client'
import { Suspense } from 'react'
import { useDeals } from '@/features/deals/useDeals'
import DealCard from '@/components/DealCard'
import CategoryMenu from '@/components/CategoryMenu'

function HotDealList() {
  const { posts, loading, userLikes, bookmarks, handleLikeToggle, handleBookmarkToggle } = useDeals()

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((deal) => (
        <DealCard 
          key={deal.id} 
          deal={deal} 
          isLiked={userLikes.has(deal.id.toString())}
          isBookmarked={bookmarks.has(deal.id.toString())}
          onLikeToggle={handleLikeToggle}
          onBookmarkToggle={handleBookmarkToggle}
        />
      ))}
    </div>
  )
}

export default function HotDealPage() {
  return (
    <div className="container py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tighter">오늘의 핫딜</h1>
        <p className="text-slate-500 font-medium">최신 할인 정보와 쇼핑 혜택을 놓치지 마세요.</p>
      </div>

      <CategoryMenu />
      
      <Suspense fallback={<div className="py-10 text-center">불러오는 중...</div>}>
        <HotDealList />
      </Suspense>
    </div>
  )
}
