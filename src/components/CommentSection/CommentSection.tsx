'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { DealComment } from '@/types/deal'
import { Send, User, Trash2, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { validateContent } from '@/lib/security'

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<DealComment[]>([])
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    fetchComments()
  }, [postId])

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('id', { ascending: true })
    if (!error) setComments(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      toast.error('로그인이 필요합니다.')
      return
    }
    if (!content.trim()) return

    // 링크 차단 필터 (유틸리티 사용)
    try {
      validateContent(content);
    } catch (error: any) {
      toast.warning('Links are not permitted to ensure a clean community.', {
        description: error.message
      });
      return;
    }

    setSubmitting(true)
    const { error } = await supabase
      .from('comments')
      .insert([{
        post_id: parseInt(postId),
        user_id: user.id,
        content: content,
        author_email: user.email
      }])

    if (error) {
      toast.error('댓글 등록 실패: ' + error.message)
    } else {
      setContent('')
      fetchComments()
      toast.success('댓글이 등록되었습니다.')
    }
    setSubmitting(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <MessageCircle className="text-blue-600" size={24} />
        <h3 className="text-2xl font-black tracking-tight">Comments ({comments.length})</h3>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? "당신의 생각을 들려주세요..." : "로그인 후 댓글을 남길 수 있습니다."}
          disabled={!user || submitting}
          className="w-full h-32 p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2rem] outline-none font-bold resize-none transition-all focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300"
        />
        <button
          type="submit"
          disabled={!user || submitting || !content.trim()}
          className="absolute bottom-4 right-4 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-200"
        >
          <Send size={20} />
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white dark:bg-slate-800/30 p-6 rounded-3xl border dark:border-slate-800 flex gap-4 transition-all hover:bg-slate-50">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0">
              <User size={20} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="font-black text-sm text-slate-900 dark:text-white mb-2">{comment.author_email?.split('@')[0]}</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{comment.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
