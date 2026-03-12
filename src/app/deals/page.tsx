'use client'
import { Suspense } from 'react'
import DealList from '@/components/DealList/DealList'
import { useDeals } from '@/features/deals/useDeals'

export default function DealsPage() {
  const { 
    posts, loading, userLikes, bookmarks, 
    handleLikeToggle, handleBookmarkToggle 
  } = useDeals()

  return (
    <Suspense fallback={<div className="container py-10">로딩 중...</div>}>
      <DealList 
        posts={posts} 
        loading={loading} 
        userLikes={userLikes} 
        bookmarks={bookmarks}
        onLikeToggle={handleLikeToggle}
        onBookmarkToggle={handleBookmarkToggle}
      />
    </Suspense>
  )
}
