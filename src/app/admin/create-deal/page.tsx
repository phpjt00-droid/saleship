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
  
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // 폼 상태 (네이버 블로그 스타일 + 확장 필드)
  const [formData, setFormData] = useState({
    title: '',
    brand_name: '',
    price: '',
    original_price: '',
    discount_rate: '',
    category: '핫딜',
    store: '',
    deal_link: '',
    promo_code: '',
    end_date: '',
    thumbnail: '',
    content: ''
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // 관리자 권한 체크 (여기서는 특정 이메일로 제한하거나 프로필의 role 필드 확인)
      // 시연을 위해 세션 존재 여부만 체크하되, 실제로는 이메일 등 추가 검증 필요
      if (!session) {
        router.push('/login?redirect=/admin/create-deal')
      } else {
        // [임시] 관리자 이메일 화이트리스트 예시
        // if (session.user.email !== 'admin@example.com') { alert('권한이 없습니다.'); router.push('/'); return; }
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
            brand_name: formData.brand_name,
            category: formData.category,
            store: formData.store || formData.brand_name,
            link: formData.deal_link,
            deal_link: formData.deal_link,
            promo_code: formData.promo_code,
            end_date: formData.end_date || null,
            image: formData.thumbnail,
            content: formData.content,
            price_info: price_info,
            authorId: user.id
          }
        ])
        .select()

      if (error) {
        if (error.code === '23505') throw new Error('이미 등록된 링크입니다.')
        throw error
      }

      setSuccess(true)
      setFormData({
        title: '', brand_name: '', price: '', original_price: '', discount_rate: '',
        category: '핫딜', store: '', deal_link: '', promo_code: '', end_date: '',
        thumbnail: '', content: ''
      })
      
      setTimeout(() => router.push('/'), 1500)

    } catch (error: any) {
      console.error('Error:', error)
      setErrorMsg(error.message || '등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-all">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            메인으로
          </Link>
          <div className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-full uppercase tracking-widest">
            Admin Dashboard
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content Area (Blog Style) */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-8 sm:p-12 space-y-8">
              {/* Title Section */}
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="제목을 입력하세요"
                  className="w-full text-3xl sm:text-4xl font-black bg-transparent border-none outline-none placeholder:text-slate-200 dark:placeholder:text-slate-700 tracking-tighter"
                />
                <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
              </div>

              {/* Summary / Meta Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Brand / Store</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        name="brand_name"
                        required
                        value={formData.brand_name}
                        onChange={handleChange}
                        placeholder="예: 나이키, 쿠팡"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Direct Link</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        name="deal_link"
                        required
                        value={formData.deal_link}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Final Price</label>
                      <input
                        type="text"
                        name="price"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="45,000"
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-black text-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Promo Code</label>
                      <input
                        type="text"
                        name="promo_code"
                        value={formData.promo_code}
                        onChange={handleChange}
                        placeholder="SALE20"
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-bold text-blue-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Thumbnail Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        name="thumbnail"
                        required
                        value={formData.thumbnail}
                        onChange={handleChange}
                        placeholder="이미지 주소 붙여넣기"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Text Content */}
              <div className="pt-4">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Content Body</label>
                <textarea
                  name="content"
                  required
                  rows={12}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="상품에 대한 상세한 설명을 적어주세요..."
                  className="w-full p-0 bg-transparent border-none outline-none resize-none text-lg leading-relaxed text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 font-medium"
                />
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 {success && <span className="text-emerald-500 font-black animate-bounce">등록 완료! 🎉</span>}
                 {errorMsg && <span className="text-rose-500 font-bold text-sm">에러: {errorMsg}</span>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {submitting ? '등록 중...' : '포스팅 발행하기'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
