'use client'

import { ShoppingBag } from 'lucide-react'

export default function MarketPage() {
  return (
    <main className="container py-20 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
        <ShoppingBag className="text-emerald-600" size={40} />
      </div>
      <h1 className="text-4xl font-black mb-4">Market</h1>
      <p className="text-slate-500 font-bold">중고 거래 서비스 준비 중입니다.</p>
    </main>
  )
}
