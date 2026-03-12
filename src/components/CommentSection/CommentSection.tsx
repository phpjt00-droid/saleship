'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Clock, Eye, Heart, MessageSquare, Bookmark, Share2, ThumbsUp, MoreHorizontal, Send, ExternalLink, TrendingDown, Info } from 'lucide-react'
import { calculatePriceMetrics, calculateLowestPrice } from '@/features/deals/dealUtils'
import { Deal } from '@/features/deals/dealTypes'
import './PostDetail.css'

const postData: Deal = {
  id: 1,
  title: '[국내선/LF스퀘어몰] 챔피온 단독 브랜드 위크 (UP TO ~90%)',
  image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1200',
  url: 'https://www.lfsquare.com/planning/detail/form?planSq=7176',
  price: '특가 균일가',
  originalPrice: '최대 90% 할인',
  discount: '90% 할인',
  store: 'LF스퀘어몰',
  shipping: '무료배송',
  likes: 854,
  comments: 42,
  views: 5241,
  createdAt: '2026-03-10T00:00:00Z',
  authorId: 'system',
  category: '패션/잡화',
  author: '세일쉽',
  avatar: '🐧',
  content: `
## 👕 챔피온(Champion) 헤리티지 브랜드 위크 오픈!

스포츠와 캐주얼웨어의 명가, 챔피온의 역대급 브랜드 위크 정보 공유드립니다. 
리버스위브 스웻이나 후드류 등 근본 아이템들을 아주 저렴하게 득템할 수 있는 기회입니다.

### ✅ 주요 행사 정보
- **행사 기간**: ~2026.03.30
- **할인율**: 최대 90% (팬츠, 티셔츠 등 다양한 품목)
- **근본 브랜드**: 빈티지 챔피언, 블루택, 레드택 등 헤리티지가 확실한 브랜드입니다.

### 💡 쇼핑 팁
US 라인, 재팬 라인, 국내 라인 등 제품군이 다양하게 섞여 있으니 사이즈와 핏을 잘 확인하고 구매하세요. 
현행 의류도 품질이 준수하여 가볍게 소비하기 매우 좋습니다. :)

---

> 🔗 **행사 바로가기**: [챔피온 브랜드 위크 상세보기](https://www.lfsquare.com/planning/detail/form?planSq=7176)

---

합리적인 소비에 도움 되시길 바랍니다. 궁금한 점은 댓글로 남겨주세요!
  `,
}

// 가상의 가격 변동 데이터 (제품 ID: 1)
const priceHistoryMock = [
  { product_id: 1, price: 59000, date: "2026-03-01" },
  { product_id: 1, price: 49000, date: "2026-03-05" },
  { product_id: 1, price: 45000, date: "2026-03-08" },
  { product_id: 1, price: 39000, date: "2026-03-10" }
]

const commentsData = [
  { id: 1, author: '얼리어답터', avatar: '🎧', date: '2026.03.09', content: '방금 지르고 왔습니다! 오랫동안 기다린 보람이 있네요. 좋은 정보 감사합니다.', likes: 12 },
  { id: 2, author: '가성비최고', avatar: '💰', date: '2026.03.09', content: '와우 회원 전용인가요? 전 일반 회원이라 그런지 16만원으로 나오네요ㅠㅠ', likes: 8 },
  { id: 3, author: '삼성매니아', avatar: '🐧', date: '2026.03.08', content: '버즈2 프로 이 가격이면 무조건 사야죠. 노캔 성능 진짜 좋습니다.', likes: 15 },
  { id: 4, author: '고민중', avatar: '🤔', date: '2026.03.08', content: '버즈3 나온다는 루머가 있어서 고민되는데... 그래도 이 가격이면 메리트 충분하겠죠?', likes: 6 },
]

import { dealService } from '@/features/deals/dealService'
import { useInteractions } from '@/hooks/useInteractions'

function PostDetailContent() {
  const params = useParams()
  const id = params?.slug as string // [slug] 라우트 파라미터 사용
  const { isLiked: liked, isBookmarked: bookmarked, likesCount, setLikesCount, toggleLike: handleLikeToggle, toggleBookmark: handleBookmarkToggle } = useInteractions(id)
  const [replies, setReplies] = useState<{ [key: string]: string }>({})
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [deal, setDeal] = useState<Deal | null>(null)
  
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  // 게시글 및 상호작용 정보 가져오기 통합
  const fetchInitialData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [postDataResolved, commentsDataResolved] = await Promise.all([
        dealService.getDealById(id as string),
        dealService.getComments(id as string)
      ]);
      setDeal(postDataResolved);
      setComments(commentsDataResolved as any);
      setLikesCount(postDataResolved.likes || 0);
    } catch (error) {
      console.error('Error fetching post detail data:', error)
      setDeal(postData) // Fallback to mock if needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    fetchInitialData();
    return () => subscription.unsubscribe()
  }, [id])

  // 가격 데이터 계산 (historyMock 사용 유지)
  const priceMetrics = calculatePriceMetrics(priceHistoryMock)
  const lowestPrice = calculateLowestPrice(priceHistoryMock, 1)

  // Chart.js 로직 등은 유지... (생략 가능하지만 여기선 유지)
  useEffect(() => {
    const initChart = () => {
      if (!chartRef.current) return
      const ctx = chartRef.current.getContext('2d')
      if (chartInstance.current) chartInstance.current.destroy()
      const sortedHistory = [...priceHistoryMock].sort((a, b) => Number(new Date(a.date)) - Number(new Date(b.date)))
      chartInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: sortedHistory.map(h => h.date.substring(5)),
          datasets: [{
            label: '가격 추이',
            data: sortedHistory.map(h => h.price),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      })
    }
    if (!window.Chart) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
      script.onload = initChart
      document.head.appendChild(script)
    } else { initChart() }
  }, [])

  const fetchComments = async () => {
     try {
       const data = await dealService.getComments(id);
       setComments(data);
     } catch (e) { console.error(e) }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!replies['main'].trim() || !user) return // Assuming 'main' is the key for the main comment input
    try {
      const newComment = {
        post_id: id,
        author: user.user_metadata?.full_name || user.email.split('@')[0],
        avatar: user.user_metadata?.avatar_url || '👤',
        content: replies['main'],
        likes: 0,
        user_id: user.id
      }
      await supabase.from('comments').insert([newComment])
      setReplies(prev => ({ ...prev, main: '' })) // Clear the main comment input
      fetchComments()
    } catch (error) { console.error(error) }
  }

  const handleCommentLike = async (commentId, currentLikes) => {
    try {
      await supabase.from('comments').update({ likes: currentLikes + 1 }).eq('id', commentId)
      fetchComments()
    } catch (error) { console.error(error) }
  }

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('댓글을 정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
      fetchComments()
    } catch (error) {
      alert('댓글 삭제 중 오류가 발생했습니다.')
      console.error('Error deleting comment:', error)
    }
  }

  if (loading && !deal) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>게시물을 불러오는 중입니다...</p>
      </div>
    )
  }

  const currentPost = deal || postData

  return (
    <div className="post-detail">
      <div className="container">
        <div className="post-detail__layout">
          {/* 본문 */}
          <article className="post-detail__main animate-fadeInUp">
            {/* 돌아가기 */}
            <Link href="/board" className="post-detail__back">
              <ArrowLeft size={18} />
              목록으로
            </Link>

            {/* 카테고리 & 메타 */}
            <div className="post-detail__meta">
              <span className="post-detail__category">{currentPost.category}</span>
              <span className="post-detail__date"><Clock size={14} />{new Date(currentPost.createdAt).toLocaleDateString()}</span>
            </div>

            {/* 제목 */}
            <h1 className="post-detail__title">{currentPost.title}</h1>

            {/* 대표 이미지 */}
            <div className="post-detail__featured-image relative h-[300px] md:h-[450px] overflow-hidden rounded-3xl mb-8">
              <Image 
                src={currentPost.image} 
                alt={currentPost.title} 
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* 가격 정보 박스 */}
            <div className="post-detail__price-box">
              <div className="price-box__info">
                <span className="price-box__discount">{currentPost.discount}</span>
                <span className="price-box__price">{currentPost.price}</span>
                <span className="price-box__original">{currentPost.originalPrice}</span>
              </div>
              <a href={currentPost.url} target="_blank" rel="noopener noreferrer" className="btn-primary price-box__btn">
                <ExternalLink size={18} /> 쇼핑몰 바로가기
              </a>
            </div>

            {/* 가격 인사이트 및 차트 */}
            <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl animate-fadeInUp delay-1">
              <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-lg">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <TrendingDown size={20} />
                </div>
                가격 변동 인사이트
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium mb-1">현재가</p>
                  <p className="text-lg font-bold text-slate-800">{priceMetrics?.current.toLocaleString() || '-'}원</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium mb-1">역대 최저가</p>
                  <p className="text-lg font-bold text-blue-600">{lowestPrice?.lowest.toLocaleString() || '-'}원</p>
                  <p className="text-[10px] text-slate-400 mt-1">({lowestPrice?.diffText || '-'} 차이)</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium mb-1">직전가 대비</p>
                  <p className={`text-lg font-bold ${priceMetrics?.diff < 0 ? 'text-blue-600' : 'text-rose-500'}`}>
                    {priceMetrics?.diffText || '-'}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium mb-1">단기 할인율</p>
                  <p className={`text-lg font-bold ${priceMetrics?.rate < 0 ? 'text-blue-600' : 'text-rose-500'}`}>
                    {priceMetrics?.rateText || '-'}
                  </p>
                </div>
              </div>

              <div className="relative h-[200px] w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <canvas id="priceChart" ref={chartRef}></canvas>
              </div>
              
              <p className="text-xs text-slate-400 mt-4 flex items-center gap-1 justify-center">
                <Info size={12} />
                위 차트 및 지표는 사용자들이 공유한 가격 정보를 기반으로 제공되며, 실제 쇼핑몰 가격과 다를 수 있습니다.
              </p>
            </div>

            {/* 작성자 */}
            <div className="post-detail__author-bar">
              <div className="post-detail__author">
                <span className="post-detail__author-avatar">{currentPost.avatar}</span>
                <div>
                  <span className="post-detail__author-name">{currentPost.author}</span>
                  <span className="post-detail__author-role">필진</span>
                </div>
              </div>
              <div className="post-detail__stats">
                <span><Eye size={14} /> {currentPost.views}</span>
                <span><Heart size={14} /> {likesCount}</span>
                <span><MessageSquare size={14} /> {currentPost.comments}</span>
              </div>
            </div>

            {/* 본문 내용 */}
            <div className="post-detail__content" dangerouslySetInnerHTML={{
              __html: currentPost.content
                .replace(/## (.*)/g, '<h2>$1</h2>')
                .replace(/### (.*)/g, '<h3>$1</h3>')
                .replace(/> (.*)/g, '<blockquote>$1</blockquote>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/---/g, '<hr />')
                .replace(/\n\n/g, '<br /><br />')
            }} />

            <div className="post-detail__actions">
              <button
                className={`post-detail__action-btn ${liked ? 'post-detail__action-btn--active' : ''}`}
                onClick={handleLikeToggle}
              >
                <ThumbsUp size={18} />
                <span>좋아요 {likesCount}</span>
              </button>
              <button
                className={`post-detail__action-btn ${bookmarked ? 'post-detail__action-btn--active' : ''}`}
                onClick={handleBookmarkToggle}
              >
                <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
                <span>관심 핫딜</span>
              </button>
              <button className="post-detail__action-btn">
                <Share2 size={18} />
                <span>공유</span>
              </button>
            </div>

            {/* 댓글 섹션 */}
            <div className="post-detail__comments">
              <h3 className="post-detail__comments-title">
                댓글 <span>{commentsData.length}</span>
              </h3>

              {/* 댓글 입력 */}
              {user ? (
                <form className="post-detail__comment-input" onSubmit={handleCommentSubmit}>
                  <input
                    type="text"
                    placeholder="댓글로 의견을 나눠보세요..."
                    value={replies['main'] || ''}
                    onChange={(e) => setReplies(prev => ({ ...prev, main: e.target.value }))}
                  />
                  <button type="submit" className="post-detail__comment-submit">
                    <Send size={16} />
                  </button>
                </form>
              ) : (
                <div className="post-detail__login-prompt" style={{ 
                  padding: '20px', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '12px', 
                  textAlign: 'center',
                  marginBottom: '20px',
                  border: '1px dashed var(--border-color)'
                }}>
                  <p style={{ marginBottom: '10px', color: '#6b7280' }}>로그인 후 댓글을 남길 수 있습니다.</p>
                  <Link href="/login" className="btn-primary" style={{ display: 'inline-flex', padding: '8px 20px', fontSize: '14px' }}>
                    로그인하러 가기
                  </Link>
                </div>
              )}

              {/* 댓글 목록 */}
              <div className="post-detail__comment-list">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>댓글을 불러오는 중입니다...</div>
                ) : comments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>첫 댓글을 남겨보세요! 🐧✨</div>
                ) : (
                  comments.map((comment, i) => (
                    <div
                      key={comment.id}
                      className="post-detail__comment animate-fadeInUp"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="post-detail__comment-header">
                        <div className="post-detail__comment-author">
                          <span className="post-detail__comment-avatar">{comment.avatar}</span>
                          <span className="post-detail__comment-name">{comment.author}</span>
                          <span className="post-detail__comment-date">
                            {new Date(comment.created_at).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            }).replace(/\. /g, '.').replace(/\.$/, '')}
                          </span>
                        </div>
                        <div className="post-detail__comment-more-container">
                          <button className="post-detail__comment-more">
                            <MoreHorizontal size={16} />
                          </button>
                          <div className="post-detail__comment-dropdown">
                            <button 
                              className="post-detail__comment-delete-btn"
                              onClick={() => handleCommentDelete(comment.id)}
                            >
                              삭제하기
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="post-detail__comment-text">{comment.content}</p>
                      <button 
                        className="post-detail__comment-like"
                        onClick={() => handleCommentLike(comment.id, comment.likes)}
                      >
                        <ThumbsUp size={13} />
                        {comment.likes}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </article>

          {/* 사이드바 */}
          <aside className="post-detail__sidebar animate-fadeInUp delay-2">
            <div className="sidebar-card">
              <h4 className="sidebar-card__title">쇼핑몰 정보</h4>
              <div className="sidebar-card__author">
                <span className="sidebar-card__avatar">📦</span>
                <div>
                  <span className="sidebar-card__name">{postData.store}</span>
                  <span className="sidebar-card__role">로켓배송 가능</span>
                </div>
              </div>
              <a href={postData.url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                쇼핑몰 방문하기
              </a>
            </div>

            <div className="sidebar-card">
              <h4 className="sidebar-card__title">지금 뜨는 핫딜</h4>
              <div className="sidebar-card__list">
                {[
                  '[네이버스토어] 아로마티카 패밀리 세일 (UP TO ~76%)', 
                  '[네오팜] 아토팜 패밀리 세일 (UP TO ~93%)', 
                  '[크록스] 크록스 패밀리 세일 (UP TO ~70%)'
                ].map((title, i) => (
                  <Link key={i} href={`/post/${i + 2}`} className="sidebar-card__link">
                    <span className="sidebar-card__rank">{i + 1}</span>
                    <span className="sidebar-card__link-text">{title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default function PostDetail() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>게시글 내용을 불러오는 중...</div>}>
      <PostDetailContent />
    </Suspense>
  )
}
