'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { dealService } from '@/features/deals/dealService'
import { DealComment } from '@/types/deal'
import { Send, User, Trash2, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { validateContent } from '@/lib/security'

interface CommentSectionProps {
  postId: string;
  initialCount?: number;
}

export default function CommentSection({ postId, initialCount = 0 }: CommentSectionProps) {
  const [comments, setComments] = useState<DealComment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await dealService.getComments(postId)
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))

    fetchComments()
    return () => subscription.unsubscribe()
  }, [fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('로그인이 필요한 서비스입니다.')
      return
    }
    
    // 링크 차단 필터 (유틸리티 사용)
    try {
      validateContent(content);
    } catch (error: any) {
      toast.warning('Links are not permitted to ensure a clean community.', {
        description: error.message
      });
      return;
    }

    if (!content.trim()) return

    try {
      setSubmitting(true)
      await dealService.addComment(postId, content, user.id)
      setContent('')
      toast.success('댓글이 성공적으로 등록되었습니다.')
      await fetchComments()
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('댓글 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-16 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle size={24} className="text-blue-600" />
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
          댓글 <span className="text-blue-600 ml-1">{comments.length > 0 ? comments.length : initialCount}</span>
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10 group relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? "다양한 의견을 남겨주세요..." : "로그인 후 댓글을 남길 수 있습니다."}
          disabled={!user || submitting}
          className="w-full h-32 p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none font-medium placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!user || submitting || !content.trim()}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-100 dark:shadow-none hover:-translate-y-1 active:scale-95"
        >
          {submitting ? '등록 중...' : (
            <>댓글 등록 <Send size={16} /></>
          )}
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-10 text-center animate-pulse">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-20 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 font-bold">첫 번째 댓글을 남겨보세요! <img src="/images/pingu-hello.png.jpg" alt="" className="inline-block w-5 h-5 mb-1 opacity-60" /></p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="group flex gap-4 p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-[2rem] transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
              <div className="shrink-0 w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                {comment.user_avatar && comment.user_avatar !== '👤' ? (
                  <img src={comment.user_avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800 dark:text-white text-sm">
                      {comment.user_name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
