'use client'

import { Suspense, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus } from 'lucide-react'
import Link from 'next/link'
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
    <main className="container py-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Hot Deals</h1>
          <p className="text-slate-500 font-medium">새롭게 올라오는 최저가 정보를 확인하세요.</p>
        </div>
        {user && (
          <Link
            href="/community/write"
            className="px-6 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
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

      <DealList />
    </main>
  )
}
