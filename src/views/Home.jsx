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
  const [deals, setDeals] = useState([])
  const [bookmarks, setBookmarks] = useState(new Set())
  const [userLikes, setUserLikes] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [sortBy, setBy] = useState('latest')

  // Load persistence from localStorage
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const savedLikes = localStorage.getItem('saleship_likes')
    const savedBookmarks = localStorage.getItem('saleship_bookmarks')
    if (savedLikes) setUserLikes(new Set(JSON.parse(savedLikes)))
    if (savedBookmarks) setBookmarks(new Set(JSON.parse(savedBookmarks)))

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

      const updatedDeals = postsData.map(post => ({
        ...post,
        upvotes: post.likes || 0,
        time: new Date(post.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
      }))
      
      setDeals(updatedDeals)
    } catch (error) {
      console.error('Error fetching deals:', error)
      setDeals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  const handleLikeToggle = (e, postId) => {
    e.preventDefault()
    e.stopPropagation()
    const idStr = postId.toString()
    setUserLikes(prev => {
      const next = new Set(prev)
      if (next.has(idStr)) next.delete(idStr)
      else next.add(idStr)
      localStorage.setItem('saleship_likes', JSON.stringify([...next]))
      return next
    })
  }

  const handleBookmarkToggle = (e, postId) => {
    e.preventDefault()
    e.stopPropagation()
    const idStr = postId.toString()
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(idStr)) next.delete(idStr)
      else next.add(idStr)
      localStorage.setItem('saleship_bookmarks', JSON.stringify([...next]))
      return next
    })
  }

  const parseValue = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const str = val.toString().toLowerCase();
    if (str.includes('%')) return parseFloat(str) || 0;
    if (str.includes('k')) return parseFloat(str) * 1000;
    return parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
  }

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesCategory = selectedCategory === '전체' || deal.category === selectedCategory;
      const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deal.store.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [deals, selectedCategory, searchQuery]);

  const sortedDeals = useMemo(() => {
    return [...filteredDeals].sort((a, b) => {
      if (sortBy === 'views') return parseValue(b.views) - parseValue(a.views);
      if (sortBy === 'comments') return b.comments - a.comments;
      if (sortBy === 'discount') return parseValue(b.discount) - parseValue(a.discount);
      return b.id - a.id; // latest
    });
  }, [filteredDeals, sortBy]);

  const top5Deals = useMemo(() => {
    return [...deals]
      .sort((a, b) => {
        const scoreA = parseValue(a.views) + (a.upvotes * 3) + (a.comments * 2);
        const scoreB = parseValue(b.views) + (b.upvotes * 3) + (b.comments * 2);
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }, [deals]);


  const categories = ['전체', '전자제품', '패션', '식품', '뷰티', '리빙', '게임']

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

      {/* Category Filter Section */}
      <section className="bg-slate-50/50 py-10 border-b border-slate-100">
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
            
            {/* Sorting Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-6 mb-2">
              {[
                { id: 'latest', label: '최신순' },
                { id: 'views', label: '조회순' },
                { id: 'comments', label: '댓글순' },
                { id: 'discount', label: '할인율' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setBy(tab.id)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    sortBy === tab.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="deals-grid">
            {sortedDeals.length > 0 ? (
              sortedDeals.map((deal, i) => (
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
