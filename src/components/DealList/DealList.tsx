'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, TrendingUp, Users, Flame, ShoppingBag, Coffee, Home as HomeIcon, Cloud, Sparkles, Smartphone, Shirt, Utensils, Anchor, Gamepad2, Ticket, MapPin } from 'lucide-react'
import Image from 'next/image'
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
  userLikes: Set<string>;
  bookmarks: Set<string>;
  onLikeToggle: (e: any, postId: string | number) => void;
  onBookmarkToggle: (e: any, postId: string | number) => void;
  isLoadingMore?: boolean;
  isReachingEnd?: boolean;
  loadMore?: () => void;
}

function BoardContent({ posts, loading, userLikes, bookmarks, onLikeToggle, onBookmarkToggle, isLoadingMore, isReachingEnd, loadMore }: DealListProps) {
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
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-700">
              <div className="relative w-64 h-64 mb-8 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-full animate-[spin_30s_linear_infinite]"></div>
                <Image 
                  src="/images/mascot-empty.png" 
                  alt="결과 없음" 
                  width={200}
                  height={200}
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">검색 결과가 없어요 🐧</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                펭귄이 열심히 찾아봤지만 찾지 못했습니다.<br />
                다른 검색어나 카테고리를 시도해보세요.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('');
                }}
                className="mt-8 px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                전체 목록으로 돌아가기
              </button>
            </div>
          )}
        </div>

        {/* 데이터 로딩 처리 및 엣지 케이스 처리 완료 */}

        {/* 더보기 (Load More) 영역 */}
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
          {isReachingEnd && sortedAndFilteredPosts.length > 0 && (
            <div className="text-slate-400 text-sm bg-slate-50 px-6 py-3 rounded-full">
              모든 핫딜을 다 확인하셨습니다! 🎉
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default function Board({ posts, loading, userLikes, bookmarks, onLikeToggle, onBookmarkToggle, isLoadingMore, isReachingEnd, loadMore }: DealListProps) {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>핫딜 목록을 불러오는 중...</div>}>
      <BoardContent 
        posts={posts} 
        loading={loading} 
        userLikes={userLikes} 
        bookmarks={bookmarks} 
        onLikeToggle={onLikeToggle} 
        onBookmarkToggle={onBookmarkToggle}
        isLoadingMore={isLoadingMore}
        isReachingEnd={isReachingEnd}
        loadMore={loadMore}
      />
    </Suspense>
  )
}
