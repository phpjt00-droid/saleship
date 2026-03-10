'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageSquare, TrendingUp, Sparkles, Clock, Eye, Flame, ShoppingCart, Percent, ThumbsUp, ChevronRight, Heart, MapPin } from 'lucide-react'
import './Home.css'

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
  const [activeTab, setActiveTab] = useState('인기')

  const sortedDeals = useMemo(() => {
    return [...trendingDeals].sort((a, b) => {
      if (activeTab === '인기') {
        return b.upvotes - a.upvotes
      } else {
        return b.timestamp - a.timestamp
      }
    })
  }, [activeTab])

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
              신뢰할 수 있는<br />
              <span className="gradient-text">세일쉽 핫딜</span> 커뮤니티
            </h1>

            <p className="hero-hot__subtitle animate-fadeInUp delay-2">
              패션부터 리빙, 뷰티까지!<br />
              검증된 세일 정보만을 큐레이션하여 공유합니다.
            </p>

            <div className="hero-hot__actions animate-fadeInUp delay-3">
              <Link href="/board" className="btn-primary">
                지금 핫딜 확인하기
              </Link>
            </div>
          </div>

          <div className="hero-hot__mascot-wrap animate-fadeInUp delay-4">
            <img src="/images/mascot.png" alt="Mascot" className="hero-hot__mascot" />
            <div className="hero-hot__mascot-glow" />
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
                className={`deals-tab ${activeTab === '인기' ? 'active' : ''}`}
                onClick={() => setActiveTab('인기')}
              >
                인기순
              </button>
              <button 
                className={`deals-tab ${activeTab === '최신' ? 'active' : ''}`}
                onClick={() => setActiveTab('최신')}
              >
                최신순
              </button>
            </div>
          </div>

          <div className="deals-grid">
            {sortedDeals.map((deal, i) => (
              <div key={deal.id} className="hot-card animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="hot-card__image-wrap">
                  <img src={deal.image} alt={deal.title} className="hot-card__image" />
                  
                  {/* Image Overlays */}
                  <div className="hot-card__overlay-top">
                    <div className="hot-card__badge hot-card__badge--discount">
                      {deal.discount}
                    </div>
                    <div className="hot-card__badge hot-card__badge--category">
                      {deal.category}
                    </div>
                  </div>
                  
                  <div className="hot-card__overlay-bottom">
                    <div className="hot-card__price-badge">
                      {deal.price}
                    </div>
                    <button className="hot-card__wish-btn" aria-label="관심 등록">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="hot-card__content">
                  <div className="hot-card__store">
                    <MapPin size={14} />
                    <span>{deal.store}</span>
                  </div>

                  <h3 className="hot-card__title">
                    <Link href={`/post/${deal.id}`}>{deal.title}</Link>
                  </h3>

                  <div className="hot-card__footer">
                    <div className="hot-card__author">
                      <span className="hot-card__author-avatar">🐧</span>
                      <div className="hot-card__author-info">
                        <span className="hot-card__author-name">{deal.author}</span>
                        <span className="hot-card__date">{deal.date}</span>
                      </div>
                    </div>
                    
                    <div className="hot-card__stats">
                      <span><TrendingUp size={14} /> {deal.upvotes}</span>
                      <span><MessageSquare size={14} /> {deal.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
