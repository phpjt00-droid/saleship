'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Clock, Eye, Heart, MessageSquare, Bookmark, Share2, ThumbsUp, MoreHorizontal, Send, ExternalLink, ShoppingCart } from 'lucide-react'
import './PostDetail.css'

const postData = {
  id: 1,
  title: '[국내선/LF스퀘어몰] 챔피온 단독 브랜드 위크 (UP TO ~90%)',
  category: '패션/잡화',
  store: 'LF스퀘어몰',
  author: '세일쉽',
  avatar: '🐧',
  date: '2026.03.10',
  views: 5241,
  likes: 854,
  comments: 42,
  price: '특가 균일가',
  originalPrice: '최대 90% 할인',
  discount: '90% 할인',
  image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1200',
  link: 'https://www.lfsquare.com/planning/detail/form?planSq=7176',
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

const commentsData = [
  { id: 1, author: '얼리어답터', avatar: '🎧', date: '2026.03.09', content: '방금 지르고 왔습니다! 오랫동안 기다린 보람이 있네요. 좋은 정보 감사합니다.', likes: 12 },
  { id: 2, author: '가성비최고', avatar: '💰', date: '2026.03.09', content: '와우 회원 전용인가요? 전 일반 회원이라 그런지 16만원으로 나오네요ㅠㅠ', likes: 8 },
  { id: 3, author: '삼성매니아', avatar: '🐧', date: '2026.03.08', content: '버즈2 프로 이 가격이면 무조건 사야죠. 노캔 성능 진짜 좋습니다.', likes: 15 },
  { id: 4, author: '고민중', avatar: '🤔', date: '2026.03.08', content: '버즈3 나온다는 루머가 있어서 고민되는데... 그래도 이 가격이면 메리트 충분하겠죠?', likes: 6 },
]

function PostDetailContent() {
  const { id } = useParams() || {}
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  // 댓글 불러오기
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  // 초기 로드 시 댓글 가져오기
  useState(() => {
    fetchComments()
  }, [id])

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      const newComment = {
        post_id: id,
        author: '사용자', // 나중에 회원가입 기능 추가 시 실제 이름으로 변경
        avatar: '👤',
        content: commentText,
        likes: 0
      }

      const { error } = await supabase
        .from('comments')
        .insert([newComment])

      if (error) throw error
      
      setCommentText('')
      fetchComments() // 목록 새로고침
    } catch (error) {
      alert('댓글 작성 중 오류가 발생했습니다.')
      console.error('Error adding comment:', error)
    }
  }

  // 댓글 좋아요
  const handleCommentLike = async (commentId, currentLikes) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ likes: currentLikes + 1 })
        .eq('id', commentId)

      if (error) throw error
      fetchComments()
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

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
              <span className="post-detail__category">{postData.category}</span>
              <span className="post-detail__date"><Clock size={14} />{postData.date}</span>
            </div>

            {/* 제목 */}
            <h1 className="post-detail__title">{postData.title}</h1>

            {/* 대표 이미지 */}
            <div className="post-detail__featured-image">
              <img src={postData.image} alt={postData.title} />
            </div>

            {/* 가격 정보 박스 */}
            <div className="post-detail__price-box">
              <div className="price-box__info">
                <span className="price-box__discount">{postData.discount}</span>
                <span className="price-box__price">{postData.price}</span>
                <span className="price-box__original">{postData.originalPrice}</span>
              </div>
              <a href={postData.link} target="_blank" rel="noopener noreferrer" className="btn-primary price-box__btn">
                <ExternalLink size={18} /> 쇼핑몰 바로가기
              </a>
            </div>

            {/* 작성자 */}
            <div className="post-detail__author-bar">
              <div className="post-detail__author">
                <span className="post-detail__author-avatar">{postData.avatar}</span>
                <div>
                  <span className="post-detail__author-name">{postData.author}</span>
                  <span className="post-detail__author-role">필진</span>
                </div>
              </div>
              <div className="post-detail__stats">
                <span><Eye size={14} /> {postData.views}</span>
                <span><Heart size={14} /> {postData.likes}</span>
                <span><MessageSquare size={14} /> {postData.comments}</span>
              </div>
            </div>

            {/* 본문 내용 */}
            <div className="post-detail__content" dangerouslySetInnerHTML={{
              __html: postData.content
                .replace(/## (.*)/g, '<h2>$1</h2>')
                .replace(/### (.*)/g, '<h3>$1</h3>')
                .replace(/> (.*)/g, '<blockquote>$1</blockquote>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/---/g, '<hr />')
                .replace(/\n\n/g, '<br /><br />')
            }} />

            {/* 액션 바 */}
            <div className="post-detail__actions">
              <button
                className={`post-detail__action-btn ${liked ? 'post-detail__action-btn--active' : ''}`}
                onClick={() => setLiked(!liked)}
              >
                <ThumbsUp size={18} />
                <span>좋아요 {liked ? postData.likes + 1 : postData.likes}</span>
              </button>
              <button
                className={`post-detail__action-btn ${bookmarked ? 'post-detail__action-btn--active' : ''}`}
                onClick={() => setBookmarked(!bookmarked)}
              >
                <Bookmark size={18} />
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
              <form className="post-detail__comment-input" onSubmit={handleCommentSubmit}>
                <input
                  type="text"
                  placeholder="댓글로 의견을 나눠보세요..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" className="post-detail__comment-submit">
                  <Send size={16} />
                </button>
              </form>

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
                        <button className="post-detail__comment-more">
                          <MoreHorizontal size={16} />
                        </button>
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
              <a href={postData.link} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
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
