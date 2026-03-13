'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { AlertCircle, PlusCircle, ArrowLeft, Image as ImageIcon, Link as LinkIcon, DollarSign, Tag, CheckCircle2, Layout, FileText, Calendar, Hash } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// 관리자 이메일 화이트리스트 (여기에 사용자 이메일을 추가해야 함)
const ADMIN_EMAILS = ['admin@saleship.com', 'ksy@example.com'] // 실제 운영 시에는 env나 DB로 관리

export default function AdminPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    brand_name: '',
    category: 'Fashion',
    deal_link: '',
    promo_code: '',
    end_date: '',
    price: '',
    original_price: '',
    discount_rate: '',
    thumbnail: '',
    summary: '',
    // 네이버 블로그 3단 구성
    content_head: '',
    content_body1: '',
    content_body2: ''
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error('관리자 로그인이 필요합니다.')
        router.push('/login?redirect=/admin/post')
        return
      }

      // 이메일 보안 강화 (실제 사용자 이메일로 교체 권장)
      const allowedEmails = ['ksy@example.com', 'admin@saleship.com']; // ksy@... 이메일 포함
      if (!allowedEmails.includes(session.user.email || '')) {
        toast.error('접근 권한이 없습니다.')
        router.push('/')
        return
      }

      setUser(session.user)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const price_info = {
        currentPrice: formData.price,
        originalPrice: formData.original_price,
        discount: formData.discount_rate
      }

      // 3단 본문을 하나의 content로 통합 (구분자 사용) 또는 개별 저장
      // 여기서는 구조화를 위해 JSON 형태로 content에 저장하는 방식을 제안하거나, 
      // 개별 컬럼이 없다면 문자열 결합을 사용합니다.
      const structuredContent = `[HEAD]\n${formData.content_head}\n\n[BODY1]\n${formData.content_body1}\n\n[BODY2]\n${formData.content_body2}`;

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: formData.title,
            brand_name: formData.brand_name,
            category: formData.category,
            store: formData.brand_name,
            link: formData.deal_link,
            deal_link: formData.deal_link,
            promo_code: formData.promo_code,
            end_date: formData.end_date || null,
            image: formData.thumbnail,
            summary: formData.summary,
            content: structuredContent, // 통합된 본문
            price_info: price_info,
            authorId: user.id
          }
        ])

      if (error) throw error

      toast.success('포스팅이 성공적으로 발행되었습니다! 🎉')
      router.push('/')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error('등록 실패: ' + (error.message || '알 수 없는 오류'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 font-bold transition-all">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            메인으로
          </Link>
          <div className="px-4 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-black rounded-full uppercase tracking-widest">
            Admin Post Interface
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-8 sm:p-12 space-y-8">
              {/* Title Input */}
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="핫딜 제목을 입력하세요 (Naver Blog 스타일)"
                  className="w-full text-3xl sm:text-4xl font-black bg-transparent border-none outline-none placeholder:text-slate-200 dark:placeholder:text-slate-700 tracking-tighter"
                />
                <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
              </div>

              {/* Grid 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="brand_name"
                      required
                      value={formData.brand_name}
                      onChange={handleChange}
                      placeholder="예: Nike, Apple"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative">
                    <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option value="Fashion">Fashion</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Food">Food</option>
                      <option value="Living">Living</option>
                      <option value="Tech">Tech</option>
                      <option value="Game">Game</option>
                      <option value="Voucher">Voucher</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid 2: Deal Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Affiliate / Deal Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="deal_link"
                      required
                      value={formData.deal_link}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Promo Code</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="promo_code"
                      value={formData.promo_code}
                      onChange={handleChange}
                      placeholder="예: SAVE50, WELCOME"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold text-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 3: Pricing & Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Final Price</label>
                  <input
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="45,000"
                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 transition-all font-black text-rose-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Original Price</label>
                  <input
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleChange}
                    placeholder="90,000"
                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold text-slate-300 line-through"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Thumbnail Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="thumbnail"
                    required
                    value={formData.thumbnail}
                    onChange={handleChange}
                    placeholder="이미지 주소를 입력하세요"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              {/* Naver Blog Style Summary */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-rose-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText size={14} /> Naver Blog Optimized Summary
                </label>
                <textarea
                  name="summary"
                  rows={4}
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="네이버 블로그 형식의 요약 정보를 입력하세요. (검색 노출 최적화)"
                  className="w-full px-6 py-5 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-[2rem] outline-none focus:border-rose-500 transition-all font-medium text-slate-700 dark:text-slate-300 resize-none"
                />
              </div>

              {/* Naver Blog Style 3-Section Content */}
              <div className="space-y-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-rose-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Layout size={14} /> Section 1: Head (도입부)
                  </label>
                  <textarea
                    name="content_head"
                    required
                    rows={4}
                    value={formData.content_head}
                    onChange={handleChange}
                    placeholder="포스팅의 도입부 내용을 입력하세요..."
                    className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 transition-all font-medium text-slate-700 dark:text-slate-300 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-rose-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FileText size={14} /> Section 2: Body 1 (상세 정보)
                  </label>
                  <textarea
                    name="content_body1"
                    required
                    rows={6}
                    value={formData.content_body1}
                    onChange={handleChange}
                    placeholder="딜의 상세 조건 및 특징을 입력하세요..."
                    className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 transition-all font-medium text-slate-700 dark:text-slate-300 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-rose-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FileText size={14} /> Section 3: Body 2 (결론 및 팁)
                  </label>
                  <textarea
                    name="content_body2"
                    required
                    rows={6}
                    value={formData.content_body2}
                    onChange={handleChange}
                    placeholder="구매 팁이나 결론을 입력하세요..."
                    className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-rose-500 transition-all font-medium text-slate-700 dark:text-slate-300 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-12 py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-3xl shadow-2xl shadow-rose-200 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {submitting ? '포스팅 발행 중...' : '프리미엄 포스팅 발행'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
