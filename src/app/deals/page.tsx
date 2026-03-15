'use client'

import { Suspense, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import DealList from '@/components/DealList/DealList'
import CategoryMenu from '@/components/CategoryMenu'

export default function DealsPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  return (
    <main className="container py-8 md:py-12">
      {/* 커뮤니티 페이지와 동일한 반응형 헤더 구조 적용 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <Image
              src="/images/pingu-shopping.png"
              alt="Shopping Pingu"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">핫딜</h1>
            <p className="text-slate-500 font-medium">새롭게 올라오는 최저가 정보를 확인하세요.</p>
          </div>
        </div>
        {user && (user.email === 'phpjt00@gmail.com' || user.app_metadata?.role === 'admin') && (
          <Link
            href="/admin/create-deal"
            className="w-full md:w-auto px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
          >
            <Plus size={20} /> 핫딜 등록
          </Link>
        )}
      </div>

      <div className="mb-10">
        <Suspense fallback={<div className="h-12 bg-slate-100 animate-pulse rounded-2xl" />}>
          <CategoryMenu />
        </Suspense>
      </div>

      {/* DealList에서 useSearchParams를 사용하므로 Suspense로 감싸야 빌드 에러가 해결됩니다 */}
      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-64 bg-slate-100 rounded-2xl" />)}
      </div>}>
        <DealList />
      </Suspense>
    </main>
  )
}