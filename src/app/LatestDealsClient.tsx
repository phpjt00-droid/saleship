'use client';

import { useDeals } from '@/features/deals/useDeals';
import DealList from '@/components/DealList/DealList';
import { Deal } from '@/types/deal';

interface LatestDealsClientProps {
  initialDeals: Deal[];
}

export default function LatestDealsClient({ initialDeals }: LatestDealsClientProps) {
  const { 
    posts, loading, userLikes, bookmarks, 
    handleLikeToggle, handleBookmarkToggle,
    isLoadingMore, isReachingEnd, loadMore
  } = useDeals();

  // 만약 posts가 비어있고(로딩 중일 때), 서버에서 받은 initialDeals가 있다면 그것을 먼저 보여줌
  // SWR Infinite가 페칭을 완료하면 posts가 채워짐
  const displayPosts = (posts.length === 0 && initialDeals.length > 0) ? initialDeals : posts;

  return (
    <DealList 
      posts={displayPosts} 
      loading={loading && posts.length === 0 && initialDeals.length === 0} 
      userLikes={userLikes} 
      bookmarks={bookmarks}
      onLikeToggle={handleLikeToggle}
      onBookmarkToggle={handleBookmarkToggle}
      isLoadingMore={isLoadingMore}
      isReachingEnd={isReachingEnd}
      loadMore={loadMore}
    />
  );
}
