'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Type, AlignLeft, Tag, Send, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { validateContent } from '@/lib/security'
import '@/components/WritePost/WritePost.css'

const categories = ['공지사항', '자유게시판', '리뷰게시판', '장터게시판']

export default function WritePost() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      alert("로그인이 필요한 서비스입니다.");
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '자유'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('내용을 입력해주세요.')
      return
    }

    // 링크 차단 필터 (유틸리티 사용)
    try {
      validateContent(formData.title + formData.content);
    } catch (error: any) {
      toast.warning('Links are not permitted to ensure a clean community.', {
        description: error.message
      });
      return;
    }

    setLoading(true)

    try {
      if (!user) {
        toast.error('로그인이 필요합니다.')
        router.push('/login')
        return
      }

      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()
      if (!session) {
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요.')
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('community_posts')
        .insert([{
          title: formData.title,
          content: formData.content,
          category: formData.category,
          author_id: session.user.id
        }])

      if (error) throw error

      toast.success('게시글이 성공적으로 등록되었습니다.')
      router.push('/community')
    } catch (error: any) {
      toast.error('등록 실패: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="container max-w-4xl px-4">
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> 취소하고 돌아가기
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight">Post Your Story</h1>
            <div className="flex items-center gap-4">
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="bg-white border dark:border-slate-800 rounded-xl px-4 py-2 font-bold text-sm outline-none"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="제목을 입력하세요"
                  className="w-full text-3xl font-black bg-transparent border-none outline-none placeholder:text-slate-200"
                />
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-4">
                <textarea 
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="당신의 이야기를 들려주세요 (불법 링크 및 홍보물은 차단될 수 있습니다)"
                  className="w-full h-[400px] text-lg font-medium bg-transparent border-none outline-none resize-none leading-relaxed placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400">
                <AlertTriangle size={16} />
                <span className="text-xs font-bold">건강한 커뮤니티 문화를 함께 만들어가요.</span>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="px-10 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black flex items-center gap-2 transition-all active:scale-95 shadow-xl disabled:opacity-50"
              >
                <Send size={20} /> {loading ? '등록 중...' : '게시글 등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
