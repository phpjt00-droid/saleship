'use client'
import { useDeals } from '@/features/deals/useDeals'
import PopularDeals from '@/components/PopularDeals/PopularDeals'
import DealList from '@/components/DealList/DealList'

export default function Home() {
  const { 
    posts, trendingDeals, popularDeals, loading, userLikes, bookmarks, 
    handleLikeToggle, handleBookmarkToggle,
    isLoadingMore, isReachingEnd, loadMore
  } = useDeals()

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* 1. Trending Deals (상단 강조) */}
      <PopularDeals 
        deals={trendingDeals} 
        userLikes={userLikes} 
        onLikeToggle={handleLikeToggle} 
      />

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 2. Latest Deals (메인 피드 - 좌측 2/3) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-lg">✨</span>
                Latest Deals
              </h2>
            </div>
            <DealList 
              posts={posts} 
              loading={loading} 
              userLikes={userLikes} 
              bookmarks={bookmarks}
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
              isLoadingMore={isLoadingMore}
              isReachingEnd={isReachingEnd}
              loadMore={loadMore}
            />
          </div>

          {/* 3. Popular Deals (사이드바 - 우측 1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-lg">🏆</span>
                Popular Deals
              </h2>
              <div className="flex flex-col gap-6">
                {popularDeals.map((deal, idx) => (
                  <div key={deal.id} className="group cursor-pointer">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        <img src={deal.image} alt={deal.title} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
                        <div className="absolute top-0 left-0 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-br-lg">
                          #{idx + 1}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center gap-1 min-w-0">
                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">
                          <a href={`/deal/${deal.id}`}>{deal.title}</a>
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span className="text-rose-500">{deal.discount}% OFF</span>
                          <span>{deal.price.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
