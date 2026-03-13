'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { BadgeCheck, Send, Link as LinkIcon, Calendar, Hash, Type, AlignLeft, Info, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { isAdmin } from '@/lib/security'

export default function AdminPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: '',
    brand_name: '',
    category: 'Fashion',
    deal_link: '',
    promo_code: '',
    end_date: '',
    thumbnail: '',
    summary_head: '',
    summary_body1: '',
    summary_body2: ''
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !isAdmin(session.user.email)) {
        toast.error('관리자 권한이 없습니다.');
        router.push('/');
        return;
      }

      setUser(session.user);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Supabase posts 테이블에 저장
      // Naver Blog 스타일로 summary를 합치거나 개별 컬럼으로 저장 (여기선 합산 요약으로 처리 가능)
      const postData = {
        title: formData.title,
        brand_name: formData.brand_name,
        category: formData.category,
        deal_link: formData.deal_link,
        promo_code: formData.promo_code,
        end_date: formData.end_date,
        thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&q=80&w=800',
        content: `${formData.summary_head}\n\n${formData.summary_body1}\n\n${formData.summary_body2}`,
        author_id: user.id,
        price_info: {
          currentPrice: "정보 확인 필요",
          originalPrice: "",
          discountRate: ""
        }
      }

      const { error } = await supabase
        .from('posts')
        .insert([postData])

      if (error) throw error

      toast.success('핫딜이 성공적으로 등록되었습니다!')
      router.push('/deals')
    } catch (error: any) {
      toast.error('등록 실패: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-400">보안 확인 중...</p>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#f5f6f7] dark:bg-slate-950 py-12">
      <div className="max-w-[800px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
            <ArrowLeft size={20} /> 관리자 목록
          </Link>
          <div className="flex items-center gap-2">
            <BadgeCheck className="text-blue-600" size={24} />
            <span className="font-black text-slate-900 dark:text-white">Admin Posting Mode</span>
          </div>
        </div>

        {/* Writing Form (Naver Blog Style) */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 overflow-hidden">
            {/* Title Section */}
            <div className="p-8 border-b dark:border-slate-800">
              <input 
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="제목을 입력하세요"
                className="w-full text-3xl font-black bg-transparent border-none outline-none placeholder:text-slate-200 dark:placeholder:text-slate-700"
              />
            </div>

            {/* Essential Info Grid */}
            <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  <Hash size={14} /> Brand Name
                </label>
                <input 
                  type="text"
                  name="brand_name"
                  required
                  value={formData.brand_name}
                  onChange={handleChange}
                  placeholder="예: 삼성전자, 나이키"
                  className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-none rounded-xl shadow-sm outline-none font-bold focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  <Type size={14} /> Category
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-none rounded-xl shadow-sm outline-none font-bold focus:ring-2 focus:ring-blue-500/20 appearance-none"
                >
                  {['Fashion', 'Beauty', 'Food', 'Living', 'Tech', 'Game', 'Voucher', 'Offline'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  <LinkIcon size={14} /> Deal URL
                </label>
                <input 
                  type="url"
                  name="deal_link"
                  required
                  value={formData.deal_link}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-none rounded-xl shadow-sm outline-none font-bold focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  <Calendar size={14} /> End Date (Optional)
                </label>
                <input 
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full h-12 px-4 bg-white dark:bg-slate-800 border-none rounded-xl shadow-sm outline-none font-bold focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Thumbnail Selection */}
            <div className="p-8 border-t dark:border-slate-800">
               <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  <ImageIcon size={14} /> Thumbnail URL
                </label>
                <input 
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="이미지 주소를 입력하세요 (미입력시 기본 이미지)"
                  className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none font-bold"
                />
            </div>

            {/* Content Summary (3-Step) */}
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center rounded-xl font-black text-sm">01</span>
                  <h3 className="font-black text-slate-900 dark:text-white">Head Summary</h3>
                </div>
                <textarea 
                  name="summary_head"
                  required
                  value={formData.summary_head}
                  onChange={handleChange}
                  placeholder="핫딜의 핵심 상품과 가장 큰 장점을 한 줄로 요약해주세요."
                  className="w-full h-24 p-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl outline-none font-bold resize-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-xl font-black text-sm">02</span>
                  <h3 className="font-black text-slate-900 dark:text-white">Price Detail</h3>
                </div>
                <textarea 
                  name="summary_body1"
                  required
                  value={formData.summary_body1}
                  onChange={handleChange}
                  placeholder="역대가 여부, 카드 할인, 쿠폰 적용 등 가격에 대한 상세 내용을 적어주세요."
                  className="w-full h-32 p-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl outline-none font-bold resize-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-500 text-white flex items-center justify-center rounded-xl font-black text-sm">03</span>
                  <h3 className="font-black text-slate-900 dark:text-white">Additional Info</h3>
                </div>
                <textarea 
                  name="summary_body2"
                  value={formData.summary_body2}
                  onChange={handleChange}
                  placeholder="구매 팁, 배송 정보, 추천 용도 등 추가 정보를 입력해주세요."
                  className="w-full h-32 p-6 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl outline-none font-bold resize-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Submit Tray */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-[2rem] border dark:border-slate-800 shadow-xl">
             <div className="flex items-center gap-2 pl-4">
                <Info size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-400">꼼꼼하게 작성된 핫딜은 신뢰를 줍니다.</span>
             </div>
             <button 
               type="submit"
               disabled={submitting}
               className={`px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black flex items-center gap-3 transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 shadow-lg shadow-blue-200'}`}
             >
               <Send size={20} />
               {submitting ? '등록 중...' : '포스팅 완료'}
             </button>
          </div>
        </form>
      </div>
    </main>
  )
}
