'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, usePathname } from 'next/navigation'
import { Search, Filter, Grid, List, Clock, Eye, Heart, ThumbsUp, MessageSquare, Bookmark, ChevronLeft, ChevronRight, TrendingUp, Users, Flame, ShoppingBag, Coffee, Home as HomeIcon, Cloud, Sparkles, Smartphone, Shirt, Utensils, Anchor, Gamepad2, Ticket, MapPin } from 'lucide-react'
import HighlightText from '../components/HighlightText'
import SkeletonCard from '../components/SkeletonCard'
import './Board.css'
import { supabase } from '../lib/supabase'

const allPosts = []

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
  const [loading, setLoading] = useState(true)
  const [bookmarks, setBookmarks] = useState(new Set())
  const [user, setUser] = useState(null)
  const [userLikes, setUserLikes] = useState(new Set())

  useEffect(() => {
    setActiveCategory(categoryParam)
    setActiveSort(sortParam)
  }, [categoryParam, sortParam])

  useEffect(() => {
    // 좋아요 정보 로드
    const savedLikes = localStorage.getItem('saleship_likes')
    if (savedLikes) {
      try {
        setUserLikes(new Set(JSON.parse(savedLikes)))
      } catch (e) {
        console.error('Failed to parse likes from localStorage', e)
      }
    }

    // 북마크 정보 로드
    const savedBookmarks = localStorage.getItem('saleship_bookmarks')
    if (savedBookmarks) {
      try {
        setBookmarks(new Set(JSON.parse(savedBookmarks)))
      } catch (e) {
        console.error('Failed to parse bookmarks from localStorage', e)
      }
    }
  }, [])

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

  // 실제 게시글 및 좋아요/북마크 정보 가져오기
  const fetchBoardData = async () => {
    try {
      setLoading(true)
      setPosts([]) // 초기화
      
      // 1. 게시글 가져오기
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false })

      if (postsError) throw postsError

      // 2. 좋아요 집계
      const { data: likesData, error: likesError } = await supabase
        .from('post_likes')
        .select('post_id')

      if (likesError) throw likesError

      const likeCounts = likesData.reduce((acc, curr) => {
        acc[curr.post_id] = (acc[curr.post_id] || 0) + 1
        return acc
      }, {})

      // 3. 데이터 변환 (category -> catKey 매핑 포함)
      const catMapping = {
        '패션': 'fashion',
        '푸드': 'food',
        '뷰티': 'beauty',
        '리빙': 'home',
        '가전': 'electronics',
        '게임': 'game',
        '상품권/이용권': 'ticket',
        '오프라인': 'offline'
      }

      const updatedPosts = postsData.map(post => ({
        ...post,
        catKey: catMapping[post.category] || '',
        likes: likeCounts[post.id.toString()] || post.likes || 0,
        views: parseInt(post.views || '0', 10),
        // price_info가 JSONB로 저장되어 있으므로 여기서 추출
        currentPrice: post.price_info?.currentPrice || '가격 확인',
        originalPrice: post.price_info?.originalPrice,
        discount: post.price_info?.discount,
        shipping: post.shipping || '무료배송',
        author: post.author || '세일쉽',
        avatar: '🐧'
      }))
      
      setPosts(updatedPosts)
    } catch (error) {
      console.error('Error fetching board data:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoardData()
  }, [user])

  // 좋아요 토글 처리 (localStorage 저장 및 즉시 카운트 반영)
  const handleLikeToggle = (e, postId) => {
    e.preventDefault()
    e.stopPropagation()

    const postIdStr = postId.toString()
    const isLiking = !userLikes.has(postIdStr)

    // 1. 사용자 좋아요 상태 업데이트
    setUserLikes(prev => {
      const newLikes = new Set(prev)
      if (isLiking) {
        newLikes.add(postIdStr)
      } else {
        newLikes.delete(postIdStr)
      }
      localStorage.setItem('saleship_likes', JSON.stringify(Array.from(newLikes)))
      return newLikes
    })

    // 2. 게시글 리스트의 likes 즉시 업데이트
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id.toString() === postIdStr) {
        return {
          ...post,
          likes: isLiking ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1)
        }
      }
      return post
    }))
  }

  // 북마크 토글 처리
  const handleBookmarkToggle = (e, postId) => {
    e.preventDefault()
    e.stopPropagation()

    const postIdStr = postId.toString()
    setBookmarks(prev => {
      const newBookmarks = new Set(prev)
      if (newBookmarks.has(postIdStr)) {
        newBookmarks.delete(postIdStr)
      } else {
        newBookmarks.add(postIdStr)
      }
      localStorage.setItem('saleship_bookmarks', JSON.stringify(Array.from(newBookmarks)))
      return newBookmarks
    })
  }

  const sortedAndFilteredPosts = useMemo(() => {
    let result = [...posts]

    if (activeCategory !== '' && activeCategory !== 'all') { // Changed from !activeCategory
      result = result.filter(post => post.catKey === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(post => 
        post.title.toLowerCase().includes(q) || 
        post.store?.toLowerCase().includes(q) || 
        post.content?.toLowerCase().includes(q)
      )
    }

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
    } else { // Default to latest if no sort or 'latest'
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
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className={`board__post-card animate-fadeInUp ${viewMode === 'list' ? 'board__post-card--list' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {viewMode === 'grid' && (
                  <div className="board__post-thumbnail relative overflow-hidden rounded-t-2xl">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105" 
                      priority={i < 4}
                      unoptimized
                    />
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
                    <HighlightText text={post.title} query={searchQuery} />
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
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><Eye size={12} />{post.views.toLocaleString()}</span>
                        <button 
                          className={`flex items-center gap-1.5 transition-colors hover:text-blue-500 ${userLikes.has(post.id.toString()) ? 'text-blue-500 font-bold' : ''}`}
                          onClick={(e) => handleLikeToggle(e, post.id)}
                        >
                           <ThumbsUp size={12} fill={userLikes.has(post.id.toString()) ? "currentColor" : "none"} />{post.likes.toLocaleString()}
                        </button>
                        <span className="flex items-center gap-1.5"><MessageSquare size={12} />{post.comments}</span>
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
