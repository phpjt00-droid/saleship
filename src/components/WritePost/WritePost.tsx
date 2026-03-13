'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import DOMPurify from 'dompurify'
import { ArrowLeft, Type, AlignLeft, Tag, Image as ImageIcon, Send, Eye, ShoppingCart, AlertTriangle } from 'lucide-react'
import { extractDealInfo } from '@/features/deals/dealUtils'
import { toast } from 'sonner'
import './WritePost.css'

const categories = ['자유', 'Q&A', '팁 & 노하우', '트렌드']

function WritePost() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('자유')
  const [preview, setPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('로그인이 필요한 서비스입니다.')
        router.push('/login')
      } else {
        setUser(session.user)
      }
    })
  }, [router])

  const handleSubmit = async () => {
    if (!user) return
    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.')
      return
    }

    // 링크 차단 필터 (정규표현식)
    const urlRegex = /(https?:\/\/|www\.|[\w-]+\.(com|net|org|kr|io|me|gov|edu|co|biz|info))/gi;
    if (urlRegex.test(title) || urlRegex.test(content)) {
      toast.warning('Links are not permitted to ensure a clean community.', {
        description: 'URL inclusion is restricted to prevent spam.'
      });
      return;
    }

    try {
      setSubmitting(true)
      const { error } = await supabase
        .from('community_posts')
        .insert([
          {
            title,
            content,
            category,
            author_id: user.id,
            author_name: user.nickname || '익명펭귄'
          }
        ])

      if (error) throw error

      toast.success('게시글이 성공적으로 등록되었습니다!')
      router.push('/community')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error('등록에 실패했습니다: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="write-post">
      <div className="container">
        <div className="write-post__header animate-fadeInUp">
          <Link href="/community" className="write-post__back">
            <ArrowLeft size={18} />
            커뮤니티로
          </Link>
          <h1 className="write-post__title">커뮤니티 글쓰기</h1>
        </div>

        <div className="write-post__form animate-fadeInUp delay-1">
          {/* Warning Banner */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl flex items-start gap-3 text-amber-700 dark:text-amber-400 mb-6 font-medium text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>깨끗한 커뮤니티 환경을 위해 **외부 링크(URL) 포함 시 게시글 등록이 제한**됩니다. 스팸 방지에 동참해 주세요! <img src="/images/pingu-announce.png.jpg" alt="" className="inline-block w-4 h-4 mb-1" /></p>
          </div>

          <div className="write-post__field">
            <label className="write-post__label">
              <Tag size={16} /> 카테고리
            </label>
            <div className="write-post__categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`write-post__cat-btn ${category === cat ? 'write-post__cat-btn--active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="write-post__field">
            <label className="write-post__label">
              <Type size={16} /> 제목
            </label>
            <input
              type="text"
              className="write-post__input"
              placeholder="게시글 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="write-post__field">
            <div className="write-post__label-row">
              <label className="write-post__label">
                <AlignLeft size={16} /> 내용
              </label>
              <button
                className={`write-post__preview-toggle ${preview ? 'write-post__preview-toggle--active' : ''}`}
                onClick={() => setPreview(!preview)}
              >
                <Eye size={14} /> 미리보기
              </button>
            </div>

            {preview ? (
              <div className="write-post__preview-content">
                {content ? (
                  <div dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      content
                        .replace(/\n/g, '<br />')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    )
                  }} />
                ) : (
                  <p className="write-post__preview-empty">미리볼 내용이 없습니다</p>
                )}
              </div>
            ) : (
               <textarea
                className="write-post__textarea"
                placeholder="내용을 입력하세요. (스팸 방지를 위해 링크 입력은 제한됩니다)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
              />
            )}
          </div>

          <div className="write-post__actions">
            <Link href="/community" className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">취소</Link>
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-100 dark:shadow-none transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                {submitting ? '등록 중...' : <><Send size={16} /> <span>게시하기</span></>}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WritePost
