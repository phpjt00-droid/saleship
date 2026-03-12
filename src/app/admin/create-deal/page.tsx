'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { AlertCircle, PlusCircle, ArrowLeft, Image as ImageIcon, Link as LinkIcon, DollarSign, Tag, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminCreateDeal() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // 성공 여부 피드백
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    original_price: '',
    discount_rate: '',
    category: '핫딜',
    store: '',
    deal_url: '',
    thumbnail: '',
    content: ''
  })

  // 어드민 검증 (간단히 로그인된 사용자 기준으로 제한. 필요시 role 체크 확장 가능)
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // 인증되지 않은 사용자 차단
        router.push('/login?redirect=/admin/create-deal')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')
    setSuccess(false)

    try {
      // price_info jsonb 매핑
      const price_info = {
        currentPrice: formData.price,
        originalPrice: formData.original_price,
        discount: formData.discount_rate
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: formData.title,
            category: formData.category,
            store: formData.store,
            link: formData.deal_url,
            image: formData.thumbnail,
            content: formData.content,
            price_info: price_info,
            authorId: user.id // 현재 로그인된 관리자 UID
          }
        ])
        .select()

      if (error) {
        if (error.code === '23505') {
          throw new Error('이미 등록된 핫딜 URL 링크입니다.')
        }
        throw error
      }

      setSuccess(true)
      // 폼 초기화
      setFormData({
        title: '',
        price: '',
        original_price: '',
        discount_rate: '',
        category: '핫딜',
        store: '',
        deal_url: '',
        thumbnail: '',
        content: ''
      })
      
      // 등록 완료 후 1.5초 뒤 메인으로 이동
      setTimeout(() => {
        router.push('/')
      }, 1500)

    } catch (error) {
      console.error('Error creating deal:', error)
      setErrorMsg(error.message || '핫딜 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
  }

  if (!user) return null; // 라우팅 전 깜빡임 방지

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 font-medium mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            홈으로 돌아가기
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <PlusCircle className="w-8 h-8 text-blue-600" />
            새 핫딜 등록 (관리자)
          </h1>
          <p className="mt-2 text-slate-500">커뮤니티에 새로운 특가 정보를 공유하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl shadow-slate-200/40 rounded-3xl p-6 sm:p-10 border border-slate-100">
          
          {success && (
            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-700 animate-fadeInUp">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-bold">성공적으로 등록되었습니다!</h3>
                <p className="text-sm text-emerald-600 mt-1">잠시 후 메인 화면으로 이동합니다...</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 animate-fadeInUp">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-bold">등록 실패</h3>
                <p className="text-sm text-rose-600 mt-1">{errorMsg}</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* 기본 정보 섹션 */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">기본 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">게시글 제목 *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="[쇼핑몰명] 상품명 가격"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2">카테고리</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium text-slate-700"
                  >
                    <option value="핫딜">핫딜</option>
                    <option value="PC/하드웨어">PC/하드웨어</option>
                    <option value="디지털/가전">디지털/가전</option>
                    <option value="패션/잡화">패션/잡화</option>
                    <option value="식품/건강">식품/건강</option>
                    <option value="생활용품">생활용품</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="store" className="block text-sm font-bold text-slate-700 mb-2">쇼핑몰명 *</label>
                  <input
                    type="text"
                    id="store"
                    name="store"
                    required
                    value={formData.store}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="예: 쿠팡, 네이버플러스"
                  />
                </div>
              </div>
            </div>

            {/* 가격 정보 섹션 */}
            <div className="space-y-6 pt-2">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-slate-400" />
                가격 정보
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-bold text-slate-700 mb-2">현재 할인가 (숫자 또는 텍스트) *</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-blue-600 font-bold"
                    placeholder="예: 45,000원"
                  />
                </div>
                
                <div>
                  <label htmlFor="original_price" className="block text-sm font-bold text-slate-700 mb-2">정상가 (선택)</label>
                  <input
                    type="text"
                    id="original_price"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="예: 89,000원"
                  />
                </div>

                <div>
                  <label htmlFor="discount_rate" className="block text-sm font-bold text-slate-700 mb-2">할인율/부가정보 (선택)</label>
                  <input
                    type="text"
                    id="discount_rate"
                    name="discount_rate"
                    value={formData.discount_rate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-rose-500 font-bold"
                    placeholder="예: 역대급 50%"
                  />
                </div>
              </div>
            </div>

            {/* 미디어 및 링크 섹션 */}
            <div className="space-y-6 pt-2">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-slate-400" />
                미디어 및 외부 링크
              </h3>
              
              <div>
                <label htmlFor="deal_url" className="block text-sm font-bold text-slate-700 mb-2">실제 구매 링크 (URL) *</label>
                <input
                  type="url"
                  id="deal_url"
                  name="deal_url"
                  required
                  value={formData.deal_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-mono text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label htmlFor="thumbnail" className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> 썸네일 이미지 링크 (URL) *
                </label>
                <input
                  type="url"
                  id="thumbnail"
                  name="thumbnail"
                  required
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-mono text-sm"
                  placeholder="https://... (.jpg, .png)"
                />
                {formData.thumbnail && (
                  <div className="mt-4 p-2 bg-slate-50 border border-slate-200 rounded-xl w-32 h-32 relative overflow-hidden">
                    <img src={formData.thumbnail} alt="미리보기" className="w-full h-full object-cover rounded-lg" onError={(e: any) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
            </div>

            {/* 본문 섹션 */}
            <div className="space-y-6 pt-2">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">상세 설명 *</h3>
              <div>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={8}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-y text-slate-700"
                  placeholder="본문 내용을 입력하세요. (마크다운 사용 가능)"
                ></textarea>
              </div>
            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
            <Link 
              href="/"
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-600/20 shrink-0"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  등록 중...
                </>
              ) : (
                '핫딜 등록하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
