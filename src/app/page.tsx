'use client'
import { useDeals } from '@/features/deals/useDeals'
import PopularDeals from '@/components/PopularDeals/PopularDeals'
import DealList from '@/components/DealList/DealList'

export default function Home() {
  const { 
    posts, popularDeals, loading, userLikes, bookmarks, 
    handleLikeToggle, handleBookmarkToggle,
    isLoadingMore, isReachingEnd, loadMore
  } = useDeals()

  return (
    <div className="home-container">
      <PopularDeals 
        deals={popularDeals} 
        userLikes={userLikes} 
        onLikeToggle={handleLikeToggle} 
      />
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
  )
}
