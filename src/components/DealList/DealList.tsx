'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, TrendingUp, Users, Flame, ShoppingBag, Coffee, Home as HomeIcon, Cloud, Sparkles, Smartphone, Shirt, Utensils, Anchor, Gamepad2, Ticket, MapPin } from 'lucide-react'
import DealCard from '@/components/DealCard'
import HighlightText from '@/components/HighlightText/HighlightText'
import SkeletonCard from '@/components/SkeletonCard/SkeletonCard'
import './Board.css'
import './Home.css'
import { dealService } from '@/features/deals/dealService'
import { filterDeals } from '@/features/deals/dealUtils'
import { Deal } from '@/types/deal'

// UI 렌더링에 필요한 카테고리 탭 정보
const categoryTabs = [
  { key: '', label: '전체핫딜', icon: Grid },
  { key: 'fashion', label: '패션', icon: Shirt },
  { key: 'food', label: '푸드', icon: Utensils },
  { key: 'beauty', label: '뷰티', icon: Sparkles },
  { key: 'home', label: '리빙', icon: HomeIcon },
  { key: 'electronics', label: '가전', icon: Smartphone },
  { key: 'game', label: '게임', icon: Gamepad2 },
  { key: 'ticket', label: '상품권/이용권', icon: Ticket },
  { key: 'offline', label: '오프라인', icon: MapPin },
]

interface DealListProps {
  posts: Deal[];
  loading: boolean;
  userLikes: Set<any>;
  bookmarks: Set<any>;
  onLikeToggle: (e: any, postId: number) => void;
  onBookmarkToggle: (e: any, postId: number) => void;
}

function BoardContent({ posts, loading, userLikes, bookmarks, onLikeToggle, onBookmarkToggle }: DealListProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('cat') || ''
  const sortParam = searchParams.get('sort') || ''

  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(categoryParam)
  const [activeSort, setActiveSort] = useState(sortParam)

  const sortedAndFilteredPosts = useMemo(() => {
    const filtered = filterDeals(posts, { category: activeCategory, query: searchQuery });
    return dealService.sortDeals(filtered, activeSort || 'latest');
  }, [posts, activeCategory, searchQuery, activeSort])

  return (
    <div className="board">
      <div className="container">
        {/* 헤더 */}
        <div className="board__header animate-fadeInUp">
          <h1 className="board__title">
            {pathname?.includes('/free') ? '자유게시판' : pathname?.includes('/review') ? '리뷰게시판' : '세일쉽 핫딜 게시판'}
            <span className="board__count">{sortedAndFilteredPosts.length}개의 글 발견</span>
          </h1>
        </div>

        {/* 필터 바 - 핫딜게시판일 때만 노출 (또는 공통 필터로 사용) */}
        {!pathname.includes('/free') && !pathname.includes('/review') && (
          <div className="board__filter-bar animate-fadeInUp delay-1">
            <div className="board__categories">
              {categoryTabs.map(tab => (
                <button
                  key={tab.key}
                  className={`board__cat-btn ${activeCategory === tab.key ? 'board__cat-btn--active' : ''}`}
                  onClick={() => setActiveCategory(tab.key)}
                >
                  <tab.icon size={15} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="board__filter-bar animate-fadeInUp delay-1">
          <div className="board__tools">
            <div className="board__sort-tabs">
              {[
                { key: '', label: '최신순' },
                { key: 'views', label: '조회수 높은순' },
                { key: 'comments', label: '댓글 많은순' },
                { key: 'discount', label: '할인율 높은순' },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`board__sort-tab ${activeSort === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveSort(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="board__right-tools">
              <div className="board__view-toggle">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} />
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className={`board__posts ${viewMode === 'list' ? 'board__posts--list' : 'board__posts--grid'}`}>
          {loading ? (
              Array(8).fill(0).map((_, idx) => <SkeletonCard key={idx} isListForm={viewMode === 'list'} />)
          ) : sortedAndFilteredPosts.length > 0 ? (
            sortedAndFilteredPosts.map((post, i) => (
              <DealCard
                key={post.id}
                deal={post}
                viewMode={viewMode as 'grid' | 'list'}
                searchQuery={searchQuery}
                isLiked={userLikes.has(post.id.toString())}
                isBookmarked={bookmarks.has(post.id.toString())}
                onLikeToggle={onLikeToggle}
                onBookmarkToggle={onBookmarkToggle}
              />
            ))
          ) : (
            <div className="board__no-results">
              검색 결과가 없습니다.
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="board__pagination animate-fadeInUp">
          <button className="board__page-btn" disabled>
            <ChevronLeft size={18} />
          </button>
          {[1, 2, 3, 4, 5].map(page => (
            <button
              key={page}
              className={`board__page-btn ${page === 1 ? 'board__page-btn--active' : ''}`}
            >
              {page}
            </button>
          ))}
          <button className="board__page-btn">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Board({ posts, loading, userLikes, bookmarks, onLikeToggle, onBookmarkToggle }: DealListProps) {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>핫딜 목록을 불러오는 중...</div>}>
      <BoardContent 
        posts={posts} 
        loading={loading} 
        userLikes={userLikes} 
        bookmarks={bookmarks} 
        onLikeToggle={onLikeToggle} 
        onBookmarkToggle={onBookmarkToggle} 
      />
    </Suspense>
  )
}
