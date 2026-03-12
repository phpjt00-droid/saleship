'use client'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MessageSquare, TrendingUp, Sparkles, Clock, Eye, Flame, ShoppingCart, ShoppingBag, Percent, ThumbsUp, ChevronRight, Heart, MapPin, Bookmark, Search } from 'lucide-react'
import HighlightText from '../components/HighlightText'
import './Home.css'
import DailyWidgets from '../components/DailyWidgets'
import { supabase } from '../lib/supabase'
import { useEffect } from 'react'
import HotDealCard from '../components/HotDealCard'
import PopularDeals from '../components/PopularDeals'

const trendingDeals = []

function Home() {
  const [activeTab, setActiveTab] = useState('최신')
  const [deals, setDeals] = useState([])
  const [bookmarks, setBookmarks] = useState(new Set())
  const [userLikes, setUserLikes] = useState(new Set())
  const [loading, setLoading] = useState(true)
  
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const [selectedCategory, setSelectedCategory] = useState('전체')

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

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false })

      if (postsError) throw postsError

      // 1. 좋아요 집계
      const { data: likesData, error: likesError } = await supabase
        .from('post_likes')
        .select('post_id')

      if (likesError) throw likesError

      const likeCounts = likesData.reduce((acc, curr) => {
        acc[curr.post_id] = (acc[curr.post_id] || 0) + 1
        return acc
      }, {})

      const updatedDeals = postsData.map(post => ({
        ...post,
        upvotes: likeCounts[post.id.toString()] || post.likes || 0,
        time: new Date(post.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
      }))
      
      setDeals(updatedDeals)
    } catch (error) {
      console.error('Error fetching deals or interactions:', error)
      // 폴백: 테이블이 없을 경우 대비 (최초 실행 시 등)
      setDeals([])
    } finally {
      setLoading(false)
    }
  }

  // 초기 로딩 시 localStorage에서 데이터 불러오기
  useEffect(() => {
    // 북마크 로드
    const savedBookmarks = localStorage.getItem('saleship_bookmarks')
    if (savedBookmarks) {
      try {
        setBookmarks(new Set(JSON.parse(savedBookmarks)))
      } catch (e) {
        console.error('Failed to parse bookmarks from localStorage', e)
      }
    }

    // 좋아요 로드
    const savedLikes = localStorage.getItem('saleship_likes')
    if (savedLikes) {
      try {
        setUserLikes(new Set(JSON.parse(savedLikes)))
      } catch (e) {
        console.error('Failed to parse likes from localStorage', e)
      }
    }
    
    fetchDeals()
  }, [])

  useEffect(() => {
    if (user) {
      fetchDeals()
    }
  }, [user])

  // 북마크 토글 처리 (localStorage 저장)
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
      
      // localStorage에 즉시 반영
      localStorage.setItem('saleship_bookmarks', JSON.stringify(Array.from(newBookmarks)))
      return newBookmarks
    })
  }

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

    // 2. 딜 리스트의 upvotes 즉시 업데이트
    setDeals(prevDeals => prevDeals.map(deal => {
      if (deal.id.toString() === postIdStr) {
        return {
          ...deal,
          upvotes: isLiking ? (deal.upvotes || 0) + 1 : Math.max(0, (deal.upvotes || 0) - 1)
        }
      }
      return deal
    }))
  }

  const filteredAndSortedDeals = useMemo(() => {
    let result = [...deals]

    // 1. 카테고리 필터링
    if (selectedCategory !== '전체') {
      result = result.filter(deal => deal.category === selectedCategory)
    }

    // 2. 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(deal => 
        deal.title.toLowerCase().includes(query) || 
        deal.store.toLowerCase().includes(query)
      )
    }

    // 3. 정렬 적용
    return result.sort((a, b) => {
      if (activeTab === '최신') {
        return b.timestamp - a.timestamp
      } else if (activeTab === '조회순') {
        const getViews = (v) => {
          if (typeof v === 'string') {
            return parseFloat(v.replace('k', '')) * (v.includes('k') ? 1000 : 1)
          }
          return v || 0
        }
        return getViews(b.views) - getViews(a.views)
      } else if (activeTab === '댓글순') {
        return (b.comments || 0) - (a.comments || 0)
      } else if (activeTab === '할인율순') {
        const getDiscount = (d) => {
          if (typeof d === 'string') {
            const match = d.match(/(\d+)%/)
            return match ? parseInt(match[1], 10) : 0
          }
          return 0
        }
        return getDiscount(b.discount) - getDiscount(a.discount)
      } else {
        return b.upvotes - a.upvotes
      }
    })
  }, [deals, activeTab, searchQuery, selectedCategory])

  // Top 5 추출 로직 (score = views + comments*2 + upvotes*3)
  const top5Deals = useMemo(() => {
    return [...deals].map(deal => {
      let numericViews = typeof deal.views === 'string' 
        ? parseFloat(deal.views.replace('k', '')) * (deal.views.includes('k') ? 1000 : 1)
        : deal.views || 0;
      
      const score = numericViews + (deal.comments * 2) + (deal.upvotes * 3);
      return { ...deal, score };
    }).sort((a, b) => b.score - a.score).slice(0, 5);
  }, [deals]);

  const categories = ['전체', '가전', '패션', '푸드', '뷰티', '리빙', '게임']

  return (
    <div className="home">
      {/* New Intro Hero Section */}
      <section className="relative bg-white pt-24 pb-16 overflow-hidden border-b border-slate-100">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50/30 to-transparent pointer-events-none" />
        
        <div className="container relative z-10 px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold mb-6 animate-fadeInUp">
              <Sparkles size={14} />
              <span>Premium Deal Curation</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 animate-fadeInUp delay-1">
              🔥 Saleship <br />
              <span className="text-orange-500">Hot Deal</span> Community
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8 animate-fadeInUp delay-2">
              Discover and share the best online deals from across the internet.<br className="hidden md:block" />
              <span className="font-semibold text-slate-700">Electronics, Fashion, Food, Beauty, Living, Gaming.</span>
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fadeInUp delay-3">
              <a 
                href="#deals" 
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-1"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Hot Deals
              </a>
              <Link 
                href="/write" 
                className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-orange-200 text-slate-700 hover:text-orange-600 font-bold rounded-2xl transition-all hover:-translate-y-1"
              >
                Submit a Deal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Hero Section (Renamed to be secondary or keeping as mascot intro) */}
      <section className="hero-hot border-b border-slate-50">
        <div className="hero-hot__bg">
          <div className="hero-hot__orb hero-hot__orb--1" />
          <div className="hero-hot__orb hero-hot__orb--2" />
        </div>

        <div className="container hero-hot__container">
          <div className="hero-hot__content">
            <div className="hero-hot__badge animate-fadeInUp">
              <Sparkles size={14} />
              <span>실시간 최저가 핫딜 정보</span>
            </div>

            <h2 className="hero-hot__title animate-fadeInUp delay-1 !text-4xl">
              무분별한 정보를 넘어<br />
              <span className="gradient-text">양질의 핫딜</span>을 경험하세요
            </h2>

            <p className="hero-hot__subtitle animate-fadeInUp delay-2">
              패션부터 리빙, 뷰티까지!<br />
              광고가 아닌, 소비자를 위한 고품질 정보를 큐레이션합니다.
            </p>
          </div>

          <div className="hero-hot__mascot-wrap animate-fadeInUp delay-4">
            <Image 
              src="/images/mascot.png" 
              alt="Mascot" 
              width={400} 
              height={400} 
              className="hero-hot__mascot" 
              priority
            />
            <div className="hero-hot__mascot-glow" />
          </div>
        </div>
      </section>

      {/* Daily Widgets Section */}
      <DailyWidgets />

      {/* Categories Filter Section */}
      <section className="py-4 bg-slate-50/30">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-2 animate-fadeInUp delay-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md transform scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange-200 hover:bg-orange-50/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Popular Deals Section */}
      <PopularDeals 
        deals={top5Deals}
        userLikes={userLikes}
        onLikeToggle={handleLikeToggle}
      />

      <section className="section deals-section" id="deals">
        <div className="container">
          <div className="deals-header">
            <h2 className="deals-title">실시간 인기 핫딜</h2>
            <div className="deals-tabs">
              <button 
                className={`deals-tab ${activeTab === '최신' ? 'active' : ''}`}
                onClick={() => setActiveTab('최신')}
              >
                최신순
              </button>
              <button 
                className={`deals-tab ${activeTab === '조회순' ? 'active' : ''}`}
                onClick={() => setActiveTab('조회순')}
              >
                조회순
              </button>
              <button 
                className={`deals-tab ${activeTab === '댓글순' ? 'active' : ''}`}
                onClick={() => setActiveTab('댓글순')}
              >
                댓글순
              </button>
              <button 
                className={`deals-tab ${activeTab === '할인율순' ? 'active' : ''}`}
                onClick={() => setActiveTab('할인율순')}
              >
                할인율순
              </button>
            </div>
          </div>

          <div className="deals-grid">
            {filteredAndSortedDeals.length > 0 ? (
              filteredAndSortedDeals.map((deal, i) => (
                <HotDealCard
                  key={deal.id}
                  deal={deal}
                  searchQuery={searchQuery}
                  isLiked={userLikes.has(deal.id.toString())}
                  isBookmarked={bookmarks.has(deal.id.toString())}
                  onLikeToggle={handleLikeToggle}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center animate-fadeIn">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">검색 결과가 없습니다</h3>
                <p className="text-slate-500">다른 키워드나 카테고리를 선택해 보세요.</p>
                <button 
                  onClick={() => {setSelectedCategory('전체');}}
                  className="mt-6 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </div>

          <div className="deals-more-btn-wrap">
            <Link href="/board" className="btn-secondary">
              전체 핫딜 더보기 <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
