'use client'
import { Suspense } from 'react'
import DealList from '@/components/DealList/DealList'
import { useDeals } from '@/features/deals/useDeals'

export default function FreeBoardPage() {
  const { 
    posts, loading, userLikes, bookmarks, 
    handleLikeToggle, handleBookmarkToggle,
    isLoadingMore, isReachingEnd, loadMore 
  } = useDeals()

  return (
    <Suspense fallback={<div className="container py-10 text-center text-slate-500">자유게시판 불러오는 중...</div>}>
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
    </Suspense>
  )
}
