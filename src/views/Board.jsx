'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import { Search, Filter, Grid, List, Clock, Eye, Heart, MessageSquare, Bookmark, ChevronLeft, ChevronRight, TrendingUp, Users, Flame, ShoppingBag, Coffee, Home as HomeIcon, Cloud, Sparkles, Smartphone, Shirt, Utensils, Anchor, Gamepad2, Ticket, MapPin } from 'lucide-react'
import './Board.css'
import { supabase } from '../lib/supabase'

const allPosts = [
  { 
    id: 1, 
    title: '[국내선/LF스퀘어몰] 챔피온 단독 브랜드 위크 (최대 ~90%)', 
    category: '패션', 
    catKey: 'fashion', 
    store: 'LF스퀘어몰',
    author: '세일쉽', 
    avatar: '🐧', 
    date: '2026.03.10', 
    views: 8241, 
    likes: 1254, 
    comments: 56, 
    currentPrice: '9,900원',
    originalPrice: '99,000원',
    discount: '-90%',
    shipping: '무료배송',
    timestamp: new Date('2026-03-10T10:00:00').getTime(),
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 2, 
    title: '[국내선/네이버스토어] 아로마티카 패밀리 세일 (최대 ~76%)', 
    category: '뷰티', 
    catKey: 'beauty', 
    store: '네이버스토어',
    author: '세일쉽', 
    avatar: '🐧', 
    date: '2026.03.09', 
    views: 5822, 
    likes: 912, 
    comments: 34, 
    currentPrice: '15,600원',
    originalPrice: '65,000원',
    discount: '-76%',
    shipping: '배송비 3,000원',
    timestamp: new Date('2026-03-09T14:00:00').getTime(),
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 3, 
    title: '[국내선/네오팜] 아토팜 패밀리 세일 (최대 ~93%)', 
    category: '뷰티', 
    catKey: 'beauty', 
    store: '네오팜샵',
    author: '세일쉽', 
    avatar: '🐧', 
    date: '2026.03.08', 
    views: 12431, 
    likes: 2102, 
    comments: 124, 
    currentPrice: '4,500원',
    originalPrice: '64,000원',
    discount: '-93%',
    shipping: '무료배송',
    timestamp: new Date('2026-03-08T09:00:00').getTime(),
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 4, 
    title: '[국내선/크록스코리아] 크록스 패밀리 세일 (최대 ~70%)', 
    category: '패션', 
    catKey: 'fashion', 
    store: '크록스코리아',
    author: '세일쉽', 
    avatar: '🐧', 
    date: '2026.03.07', 
    views: 7122, 
    likes: 832, 
    comments: 67, 
    currentPrice: '29,800원',
    originalPrice: '99,000원',
    discount: '-70%',
    shipping: '무료배송',
    timestamp: new Date('2026-03-07T11:00:00').getTime(),
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400'
  }
]

// 요청받은 9개 카테고리 구성
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

function BoardContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('cat') || ''
  const sortParam = searchParams.get('sort') || ''

  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(categoryParam)
  const [activeSort, setActiveSort] = useState(sortParam)
  const [posts, setPosts] = useState(allPosts)
  const [bookmarks, setBookmarks] = useState(new Set())
  const [user, setUser] = useState(null)

  useEffect(() => {
    setActiveCategory(categoryParam)
    setActiveSort(sortParam)
  }, [categoryParam, sortParam])

  // 사용자 인증 정보 가져오기
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 실제 좋아요 및 북마크 정보 가져오기
  const fetchInteractions = async () => {
    try {
      // 1. 좋아요 집계
      const { data: likesData, error: likesError } = await supabase
        .from('post_likes')
        .select('post_id')

      if (likesError) throw likesError

      const likeCounts = likesData.reduce((acc, curr) => {
        acc[curr.post_id] = (acc[curr.post_id] || 0) + 1
        return acc
      }, {})

      const updatedPosts = allPosts.map(post => ({
        ...post,
        likes: likeCounts[post.id.toString()] || 0
      }))
      setPosts(updatedPosts)

      // 2. 현재 사용자의 북마크 정보 가져오기
      if (user) {
        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from('post_bookmarks')
          .select('post_id')
          .eq('user_id', user.id)

        if (bookmarkError) throw bookmarkError
        setBookmarks(new Set(bookmarkData.map(b => b.post_id)))
      }
    } catch (error) {
      console.error('Error fetching interactions:', error)
    }
  }

  useEffect(() => {
    fetchInteractions()
  }, [user])

  // 북마크 토글 처리
  const handleBookmarkToggle = async (e, postId) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      alert('로그인 후 북마크 기능을 사용할 수 있습니다.')
      return
    }

    const postIdStr = postId.toString()
    const isBookmarked = bookmarks.has(postIdStr)
    const newBookmarks = new Set(bookmarks)

    if (isBookmarked) {
      newBookmarks.delete(postIdStr)
    } else {
      newBookmarks.add(postIdStr)
    }
    setBookmarks(newBookmarks)

    try {
      if (isBookmarked) {
        await supabase.from('post_bookmarks').delete().eq('post_id', postIdStr).eq('user_id', user.id)
      } else {
        await supabase.from('post_bookmarks').insert({ post_id: postIdStr, user_id: user.id })
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      // Rollback
      setBookmarks(bookmarks)
      alert('북마크 처리 중 오류가 발생했습니다.')
    }
  }

  const sortedAndFilteredPosts = useMemo(() => {
    let result = posts.filter(post => {
      const matchCategory = !activeCategory || post.catKey === activeCategory
      const matchSearch = !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })

    if (activeSort === 'popular') {
      result.sort((a, b) => b.likes - a.likes)
    } else if (activeSort === 'views') {
      result.sort((a, b) => b.views - a.views)
    } else if (activeSort === 'comments') {
      result.sort((a, b) => b.comments - a.comments)
    } else if (activeSort === 'discount') {
      result.sort((a, b) => {
        const getDiscountValue = (d) => {
          if (!d) return 0
          const match = d.match(/\d+/)
          return match ? parseInt(match[0], 10) : 0
        }
        return getDiscountValue(b.discount) - getDiscountValue(a.discount)
      })
    } else {
      result.sort((a, b) => b.timestamp - a.timestamp)
    }

    return result
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
              <div className="board__search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="핫딜 제목 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

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
          {sortedAndFilteredPosts.length > 0 ? (
            sortedAndFilteredPosts.map((post, i) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className={`board__post-card animate-fadeInUp ${viewMode === 'list' ? 'board__post-card--list' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {viewMode === 'grid' && (
                  <div className="board__post-thumbnail relative overflow-hidden rounded-t-2xl">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {/* 할인율 뱃지 (좌상단) */}
                    {post.discount && (
                      <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 transition-transform group-hover:scale-110">
                        {post.discount}
                      </div>
                    )}
                    {/* 북마크 버튼 (우상단) */}
                    <button 
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${bookmarks.has(post.id.toString()) ? 'bg-amber-400 text-white' : 'bg-slate-900/40 text-white hover:bg-slate-900/60'}`}
                      onClick={(e) => handleBookmarkToggle(e, post.id)}
                    >
                      <Bookmark size={14} fill={bookmarks.has(post.id.toString()) ? "currentColor" : "none"} />
                    </button>
                  </div>
                )}
                
                <div className="board__post-info p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase border border-slate-200">{post.store}</span>
                      <span className="text-[10px] font-medium text-slate-400">{post.shipping}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} />{post.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-3 h-10 leading-snug group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-lg font-black text-slate-900">{post.currentPrice}</span>
                      {post.originalPrice && (
                        <span className="text-xs text-slate-400 line-through decoration-slate-300">{post.originalPrice}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span className="text-sm">{post.avatar}</span>
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Eye size={12} />{post.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Heart size={12} fill={post.likes > 0 ? "currentColor" : "none"} />{post.likes.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><MessageSquare size={12} />{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
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

export default function Board() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>핫딜 목록을 불러오는 중...</div>}>
      <BoardContent />
    </Suspense>
  )
}
