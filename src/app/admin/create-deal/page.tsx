'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { BadgeCheck, Send, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { isAdmin } from '@/lib/security'

export default function CreateDealPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    brand_name: '',
    category: 'Fashion',
    deal_link: '',
    thumbnail: '',
    content: ''
  })

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin(user.email)) {
        toast.error('권한이 없습니다.')
        router.push('/')
      }
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('로그인이 필요합니다.')

      const { error } = await supabase
        .from('posts')
        .insert([{
          ...formData,
          author_id: session.user.id,
          price_info: { currentPrice: '정보 확인 필요', originalPrice: '', discountRate: '' }
        }])

      if (error) throw error

      toast.success('등록되었습니다!')
      router.push('/deals')
    } catch (error: any) {
      toast.error('등록 실패: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="container max-w-2xl px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors">
          <ArrowLeft size={20} /> 관리자 목록
        </Link>
        
        <h1 className="text-3xl font-black mb-8">새 핫딜 등록</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 space-y-6 border border-white">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Title</label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="핫딜 제목을 입력하세요"
                className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Brand</label>
                <input 
                  type="text"
                  required
                  value={formData.brand_name}
                  onChange={(e) => setFormData({...formData, brand_name: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500/20"
                >
                  {['Fashion', 'Beauty', 'Food', 'Living', 'Tech', 'Game', 'Voucher', 'Offline'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Deal Link</label>
              <input 
                type="url"
                required
                value={formData.deal_link}
                onChange={(e) => setFormData({...formData, deal_link: e.target.value})}
                placeholder="https://..."
                className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Thumbnail URL</label>
              <input 
                type="text"
                value={formData.thumbnail}
                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                placeholder="이미지 URL"
                className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Content</label>
              <textarea 
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full h-40 p-6 bg-slate-50 border-none rounded-2xl outline-none font-bold resize-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-100 disabled:opacity-50"
            >
              <Send size={20} />
              {loading ? '등록 중...' : '핫딜 발행하기'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
