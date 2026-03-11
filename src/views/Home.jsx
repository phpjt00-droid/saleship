'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MessageSquare, TrendingUp, Sparkles, Clock, Eye, Flame, ShoppingCart, ShoppingBag, Percent, ThumbsUp, ChevronRight, Heart, MapPin, Bookmark, Search } from 'lucide-react'
import './Home.css'
import DailyWidgets from '../components/DailyWidgets'
import { supabase } from '../lib/supabase'
import { useEffect } from 'react'

const trendingDeals = [
  {
    id: 1,
    title: '[국내선/LF스퀘어몰] 챔피온 단독 브랜드 위크 (최대 ~90%)',
    category: '패션',
    store: 'LF스퀘어몰',
    time: '3월 10일',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=800',
    price: '균일가 특가',
    originalPrice: '정가 대비 90%',
    discount: '90% 할인',
    upvotes: 1254,
    comments: 56,
    views: '8.2k',
    timestamp: new Date('2026-03-10T10:00:00').getTime(),
    author: '세일쉽',
    date: '2026.03.10'
  },
  {
    id: 2,
    title: '[국내선/네이버스토어] 아로마티카 패밀리 세일 (최대 ~76%)',
    category: '뷰티',
    store: '네이버스토어',
    time: '3월 09일',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    price: '팸셀 특가',
    originalPrice: '브랜드 공식가',
    discount: '76% 할인',
    upvotes: 912,
    comments: 34,
    views: '5.8k',
    timestamp: new Date('2026-03-09T14:00:00').getTime(),
    author: '세일쉽',
    date: '2026.03.09'
  },
  {
    id: 3,
    title: '[국내선/네오팜] 아토팜 패밀리 세일 (최대 ~93%)',
    category: '뷰티',
    store: '네오팜샵',
    time: '3월 08일',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
    price: '초특가 할인',
    originalPrice: '시중가 대비 93%',
    discount: '93% 할인',
    upvotes: 2102,
    comments: 124,
    views: '12.4k',
    timestamp: new Date('2026-03-08T09:00:00').getTime(),
    author: '세일쉽',
    date: '2026.03.08'
  },
  {
    id: 4,
    title: '[국내선/크록스] 크록스 패밀리 세일 (최대 ~70%)',
    category: '패션',
    store: '크록스코리아',
    time: '3월 07일',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
    price: '시즌 오프가',
    originalPrice: '정상가',
    discount: '70% 할인',
    upvotes: 832,
    comments: 67,
    views: '7.1k',
    timestamp: new Date('2026-03-07T11:00:00').getTime(),
    author: '세일쉽',
    date: '2026.03.07'
  },
  {
    id: 5,
    title: '[국내선/기타] 헨켈 신학기 세일 위크 (최대 ~82%)',
    category: '리빙',
    store: '헨켈공식몰',
    time: '3월 06일',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800',
    price: '신학기 세일',
    originalPrice: '정가',
    discount: '82% 할인',
    upvotes: 431,
    comments: 25,
    views: '3.5k',
    timestamp: new Date('2026-03-06T15:00:00').getTime(),
    author: '세일쉽',
    date: '2026.03.06'
  }
]

function Home() {
  const [activeTab, setActiveTab] = useState('최신')
  const [deals, setDeals] = useState(trendingDeals)
  const [bookmarks, setBookmarks] = useState(new Set())
  const [user, setUser] = useState(null)
  const [userLikes, setUserLikes] = useState(new Set())

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

  // 실제 좋아요 정보 가져오기 (사용자별 좋아요는 localStorage 사용)
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

      const updatedDeals = trendingDeals.map(deal => ({
        ...deal,
        upvotes: likeCounts[deal.id.toString()] || 0
      }))
      setDeals(updatedDeals)
    } catch (error) {
      console.error('Error fetching interactions for home:', error)
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
    
    fetchInteractions()
  }, [])

  useEffect(() => {
    if (user) {
      fetchInteractions()
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

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')

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
      {/* Hero Section with Mascot */}
      <section className="hero-hot">
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

            <h1 className="hero-hot__title animate-fadeInUp delay-1">
              무분별한 정보를 넘어<br />
              <span className="gradient-text">양질의 핫딜</span>을 경험하세요
            </h1>

            <p className="hero-hot__subtitle animate-fadeInUp delay-2">
              패션부터 리빙, 뷰티까지!<br />
              광고가 아닌, 소비자를 위한 고품질 정보를 큐레이션합니다.
            </p>

            <div className="hero-hot__actions animate-fadeInUp delay-3">
              <Link href="/board" className="btn-primary">
                지금 핫딜 확인하기
              </Link>
            </div>
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

      {/* Search & Filter Section */}
      <section className="py-8 bg-slate-50/30">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="relative group animate-fadeInUp">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm hover:border-slate-300"
                placeholder="찾으시는 상품명이나 키워드를 입력해 보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 animate-fadeInUp delay-1">
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
      <section className="section bg-gradient-to-b from-transparent to-slate-50/50 pt-8 pb-12">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="text-orange-500" size={24} />
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">🔥 Today's Popular Deals</h2>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="divide-y divide-slate-100/80">
              {top5Deals.map((deal, index) => (
                <Link 
                  key={deal.id} 
                  href={`/post/${deal.id}`}
                  className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-all group"
                >
                  <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg
                    ${index === 0 ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 
                      index === 1 ? 'bg-slate-700 text-white shadow-lg shadow-slate-200' : 
                      index === 2 ? 'bg-orange-400 text-white shadow-lg shadow-orange-100' : 
                      'bg-slate-100 text-slate-400'}`}
                  >
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {deal.store}
                        </span>
                        {deal.discount && (
                          <span className="text-[11px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                            {deal.discount}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
                        {deal.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center sm:justify-end gap-6 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-black text-slate-900">{deal.currentPrice}</div>
                        {deal.originalPrice && (
                          <div className="text-[11px] text-slate-400 line-through opacity-70">{deal.originalPrice}</div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                        <MessageSquare size={14} className="text-slate-400" />
                        {deal.comments}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Deals Section */}
      <section className="section deals-section">
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
                <div key={deal.id} className="hot-card animate-fadeInUp group cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
                  <Link href={`/post/${deal.id}`} className="block h-full flex flex-col">
                    <div className="hot-card__image-wrap relative overflow-hidden h-48">
                      <Image 
                        src={deal.image} 
                        alt={deal.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="hot-card__image object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      
                      {/* 할인율 뱃지 (좌상단) */}
                      <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 transition-transform group-hover:scale-110">
                        {deal.discount}
                      </div>

                      {/* 북마크 버튼 추가 */}
                      <button 
                        className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all z-20 ${bookmarks.has(deal.id.toString()) ? 'bg-amber-400 text-white' : 'bg-slate-900/40 text-white hover:bg-slate-900/60'}`}
                        onClick={(e) => handleBookmarkToggle(e, deal.id)}
                      >
                        <Bookmark size={12} fill={bookmarks.has(deal.id.toString()) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    
                    <div className="hot-card__content p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase border border-slate-200">{deal.store}</span>
                         <span className="text-[10px] text-slate-400 ml-auto">{deal.shipping}</span>
                      </div>

                      <h3 className="hot-card__title text-sm font-bold text-slate-900 line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors h-10">
                        {deal.title}
                      </h3>

                      <div className="mt-auto">
                        <div className="flex items-baseline gap-1.5 mb-3">
                          <span className="text-lg font-black text-slate-900">{deal.currentPrice}</span>
                          {deal.originalPrice && (
                            <span className="text-xs text-slate-400 line-through decoration-slate-300">{deal.originalPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[10px] text-slate-400">
                          <div className="flex items-center gap-3">
                            <button 
                              className={`flex items-center gap-1 transition-colors hover:text-blue-500 ${userLikes.has(deal.id.toString()) ? 'text-blue-500 font-bold' : ''}`}
                              onClick={(e) => handleLikeToggle(e, deal.id)}
                            >
                              <ThumbsUp size={10} fill={userLikes.has(deal.id.toString()) ? "currentColor" : "none"} /> 
                              {deal.upvotes}
                            </button>
                            <span className="flex items-center gap-1"><MessageSquare size={10} /> {deal.comments}</span>
                          </div>
                          <span className="flex items-center gap-1"><Eye size={10} /> {deal.views}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center animate-fadeIn">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">검색 결과가 없습니다</h3>
                <p className="text-slate-500">다른 키워드나 카테고리를 선택해 보세요.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setSelectedCategory('전체');}}
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
