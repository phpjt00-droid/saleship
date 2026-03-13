'use client'

import { Suspense } from 'react'
import DealList from '@/components/DealList/DealList'
import CategoryMenu from '@/components/CategoryMenu'

export default function DealsPage() {
  return (
    <main className="container py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-4">Hot Deals</h1>
        <p className="text-slate-500 font-medium">실시간으로 올라오는 최저가 정보를 확인하세요.</p>
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
