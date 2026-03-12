'use client'
import { Suspense } from 'react'
import { useDeals } from '@/features/deals/useDeals'
import DealCard from '@/components/DealCard'
import CategoryMenu from '@/components/CategoryMenu'

function HotDealList() {
  const { posts, loading, userLikes, bookmarks, handleLikeToggle, handleBookmarkToggle, isLoadingMore, isReachingEnd, loadMore } = useDeals()

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col">
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
      
      <div className="flex justify-center mt-12 mb-8 animate-fadeInUp">
        {!isReachingEnd && (
          <button 
            onClick={loadMore} 
            disabled={isLoadingMore || loading}
            className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoadingMore ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                불러오는 중...
              </>
            ) : (
              <>더보기</>
            )}
          </button>
        )}
        {isReachingEnd && posts.length > 0 && (
          <div className="text-slate-400 text-sm bg-slate-50 px-6 py-3 rounded-full">
            모든 오늘의 핫딜을 다 확인하셨습니다! 🎉
          </div>
        )}
      </div>
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
