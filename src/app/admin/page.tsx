'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { dealService } from '@/features/deals/dealService'
import { LayoutGrid, Type, Tag, Camera, Link as LinkIcon, FileText, ChevronRight, Save, Image as ImageIcon } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    discount: '',
    image: '',
    url: '',
    content: '',
    category: '전자제품'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await dealService.createDeal({
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
        discount: Number(formData.discount) || 0,
      })
      
      alert('핫딜이 성공적으로 등록되었습니다!')
      router.push(`/deal/${result.slug}`)
    } catch (error) {
      console.error('Error creating deal:', error)
      alert('등록 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['전자제품', '패션/잡화', '뷰티', '식품', '생활/홈', '취미/게임', '기타']

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <div className="container py-12 md:py-20 max-w-4xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-blue-600 font-black text-sm uppercase tracking-widest mb-4">
            <LayoutGrid size={20} /> 관리자 패널
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
            신규 핫딜 등록
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            새로운 할인 정보를 커뮤니티에 공유하세요. 정확한 정보 입력은 신뢰의 시작입니다.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 섹션 */}
          <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700/50">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
              <Type className="text-blue-500" /> 기본 정보
            </h2>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-400 ml-2">게시글 제목 *</label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="예: [쿠팡] 삼성전자 갤럭시 버즈3 프로 단독 할인"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-bold placeholder:text-slate-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-400 ml-2">소제목 / 간단 설명</label>
                <input
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="핵심 요약 정보를 입력하세요"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-bold placeholder:text-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-400 ml-2">카테고리</label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-bold appearance-none"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400" size={18} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-400 ml-2">쇼핑몰 링크 *</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      required
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-bold placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 가격 정보 섹션 */}
          <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700/50">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
              <Tag className="text-rose-500" /> 가격 및 혜택
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-400 ml-2">최종 할인가 *</label>
                <input
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-bold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-400 ml-2">정상가 (선택)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-bold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-400 ml-2">할인율 (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-bold"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 이미지 섹션 */}
          <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700/50">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
              <Camera className="text-amber-500" /> 이미지 정보
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <label className="text-sm font-bold text-slate-400 ml-2">이미지 URL *</label>
                <div className="relative">
                  <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    required
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="상품 이미지 주소를 입력하세요"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-bold placeholder:text-slate-300"
                  />
                </div>
                <p className="text-xs text-slate-400 font-medium px-2">권장 사이즈: 800x800px 이상의 정방형 이미지</p>
              </div>
              
              <div className="w-full md:w-48 aspect-square bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="text-center">
                    <ImageIcon size={32} className="mx-auto text-slate-200 mb-2" />
                    <span className="text-[10px] text-slate-300 font-bold uppercase">Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 본문 섹션 */}
          <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700/50">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
              <FileText className="text-teal-500" /> 상세 내용
            </h2>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              placeholder="구매 팁, 수량 정보, 쿠폰 적용 방법 등을 자유롭게 작성하세요"
              className="w-full p-8 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-[2rem] outline-none transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-lg font-black rounded-3xl transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              취소하기
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-lg font-black rounded-3xl transition-all shadow-xl shadow-blue-100 dark:shadow-none hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>핫딜 등록 완료 <Save size={20} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
