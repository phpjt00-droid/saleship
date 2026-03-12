'use client'
import { Suspense } from 'react'
import DealList from '@/components/DealList/DealList'
import { useDeals } from '@/features/deals/useDeals'

export default function ReviewBoardPage() {
  const { 
    posts, loading, userLikes, bookmarks, 
    handleLikeToggle, handleBookmarkToggle 
  } = useDeals()

  return (
    <Suspense fallback={<div className="container py-10 text-center text-slate-500">리뷰게시판 불러오는 중...</div>}>
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
