'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Grid, List, Clock, Eye, Heart, MessageSquare, ChevronLeft, ChevronRight, TrendingUp, Users, Flame, ShoppingBag, Coffee, Home as HomeIcon, Cloud, Sparkles, Smartphone, Shirt, Utensils, Anchor, Gamepad2, Ticket, MapPin } from 'lucide-react'
import './Board.css'

const allPosts = [
  { 
    id: 1, 
    title: '[국내선/LF스퀘어몰] 챔피온 단독 브랜드 위크 (UP TO ~90%)', 
    category: '패션', 
    catKey: 'fashion', 
    author: '세일쉽', 
    avatar: '🐧', 
    date: '2026.03.10', 
    views: 5241, 
    likes: 854, 
    comments: 42, 
    timestamp: Date.now() - 3600000,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 2, 
    title: '[국내선/네이버스토어] 아로마티카 패밀리 세일 (UP TO ~76%)', 
    category: '뷰티', 
    catKey: 'beauty', 
    author: '세일쉽', 
    avatar: '🐧', 
    date: '2026.03.10', 
    views: 3822, 
    likes: 612, 
    comments: 28, 
    timestamp: Date.now() - 7200000,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 3, 
    title: '[국내선/네오팜] 아토팜 패밀리 세일 (UP TO ~93%)', 
    category: '뷰티', 
    catKey: 'beauty', 
    author: '세일쉽', 
    avatar: '🐧', 
    date: '2026.03.10', 
    views: 8431, 
    likes: 1102, 
    comments: 95, 
    timestamp: Date.now() - 10800000,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 4, 
    title: '[국내선/크록스코리아] 크록스 패밀리 세일 (UP TO ~70%)', 
    category: '패션', 
    catKey: 'fashion', 
    author: '세일쉽', 
    avatar: '🐧', 
    date: '2026.03.10', 
    views: 4122, 
    likes: 432, 
    comments: 53, 
    timestamp: Date.now() - 14400000,
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
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('cat') || ''
  const sortParam = searchParams.get('sort') || ''

  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(categoryParam)
  const [activeSort, setActiveSort] = useState(sortParam)

  useEffect(() => {
    setActiveCategory(categoryParam)
    setActiveSort(sortParam)
  }, [categoryParam, sortParam])

  const sortedAndFilteredPosts = useMemo(() => {
    let result = allPosts.filter(post => {
      const matchCategory = !activeCategory || post.catKey === activeCategory
      const matchSearch = !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })

    if (activeSort === 'popular') {
      result.sort((a, b) => b.likes - a.likes)
    } else {
      result.sort((a, b) => b.timestamp - a.timestamp)
    }

    return result
  }, [activeCategory, searchQuery, activeSort])

  return (
    <div className="board">
      <div className="container">
        {/* 헤더 */}
        <div className="board__header animate-fadeInUp">
          <h1 className="board__title">
            세일쉽 핫딜 게시판
            <span className="board__count">{sortedAndFilteredPosts.length}개의 딜 발견</span>
          </h1>
        </div>

        {/* 필터 바 */}
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

          <div className="board__tools">
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
                  <div className="board__post-thumbnail">
                    <img src={post.image} alt={post.title} />
                  </div>
                )}
                
                <div className="board__post-info">
                  <div className="board__post-top">
                    <span className="board__post-category">{post.category}</span>
                    <span className="board__post-date"><Clock size={12} />{post.date}</span>
                  </div>
                  <h3 className="board__post-title">{post.title}</h3>
                  <div className="board__post-bottom">
                    <div className="board__post-author">
                      <span className="board__post-avatar">{post.avatar}</span>
                      <span>{post.author}</span>
                    </div>
                    <div className="board__post-stats">
                      <span><Eye size={13} />{post.views.toLocaleString()}</span>
                      <span><Heart size={13} />{post.likes.toLocaleString()}</span>
                      <span><MessageSquare size={13} />{post.comments}</span>
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
