'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { MessageCircle, LayoutGrid, Award, ShoppingBag, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    async function fetchPosts() {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('id', { ascending: false })
      
      if (!error) setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <main className="container py-12">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <Image 
              src="/images/pingu-announce.png" 
              alt="Announce Pingu" 
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">커뮤니티</h1>
            <p className="text-slate-500 font-medium">자유로운 정보 공유와 소통의 공간입니다.</p>
          </div>
        </div>
        {user && (
          <Link 
            href="/community/write" 
            className="px-6 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
          >
            <Plus size={20} /> 글쓰기
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl" />)
          ) : posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 hover:shadow-xl transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 rounded-lg uppercase tracking-widest">{post.category}</span>
                  <span className="text-xs font-bold text-slate-400">
                    {formatDistanceToNow(new Date(post.created_at || Date.now()), { addSuffix: true, locale: ko })}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{post.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed font-medium">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1.5 text-xs font-black"><MessageCircle size={14} /> 0</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-400 font-bold">첫 게시글을 남겨보세요!</div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200">
            <h3 className="text-xl font-black mb-4">Community Rules</h3>
            <ul className="space-y-3 text-sm font-bold text-blue-100">
              <li>• 상업적 스팸 홍보 금지 (링크 포함 제한)</li>
              <li>• 서로를 존중하는 매너 소통</li>
              <li>• 유용한 정보 공유 장려</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
