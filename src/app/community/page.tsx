'use client'
import { Suspense } from 'react'
import { useDeals } from '@/features/deals/useDeals'
import DealCard from '@/components/DealCard'

function CommunityContent() {
  const { posts, loading, userLikes, bookmarks, handleLikeToggle, handleBookmarkToggle } = useDeals()

  // 팁이나 QNA 카테고리만 필터링 (예시 필터)
  const commPosts = posts.filter(p => !p.store || p.category === 'tips' || p.category === 'qna')

  if (loading) return <div className="py-10 text-center">불러오는 중...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {commPosts.map((deal) => (
        <DealCard 
          key={deal.id} 
          deal={deal}
          isLiked={userLikes.has(deal.id.toString())}
          isBookmarked={bookmarks.has(deal.id.toString())}
          onLikeToggle={handleLikeToggle}
          onBookmarkToggle={handleBookmarkToggle}
        />
      ))}
      {commPosts.length === 0 && (
        <div className="col-span-full py-20 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl">
          아직 커뮤니티 게시글이 없습니다. 첫 글을 남겨보세요!
        </div>
      )}
    </div>
  )
}

export default function CommunityPage() {
  return (
    <div className="container py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tighter">커뮤니티</h1>
        <p className="text-slate-500 font-medium">다양한 정보와 꿀팁을 나누는 공간입니다.</p>
      </div>
      
      <Suspense fallback={<div className="py-10 text-center">로딩 중...</div>}>
        <CommunityContent />
      </Suspense>
    </div>
  )
}
