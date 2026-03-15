'use client'

import { useState, useEffect } from 'react'
import { dealService } from '@/features/deals/dealService'
import { Deal } from '@/types/deal'
import DealCard from '@/components/DealCard'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function DealList() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true)
      try {
        const cat = searchParams.get('cat') || 'all'
        const sort = searchParams.get('sort') || 'latest'
        // 'q' 대신 모바일 검색창에서 사용하는 'search' 파라미터를 가져오도록 수정
        const query = searchParams.get('search') || ''

        const data = await dealService.getDeals({ category: cat, sort, query })
        setDeals(data)
      } catch (error) {
        console.error('Failed to fetch deals:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [searchParams]) // searchParams가 변경되면 자동 재실행

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-[450px] bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-[2.5rem]" />
      ))}
    </div>
  )

  if (deals.length === 0) return (
    <div className="py-20 text-center">
      <div className="relative w-48 h-48 mx-auto mb-8">
        <Image src="/images/pingu-search.png.jpg" alt="No results" fill className="object-contain opacity-20" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">검색 결과가 없습니다.</h3>
      <p className="text-slate-500 font-bold">다른 검색어나 카테고리를 시도해보세요.</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      {deals.map(deal => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  )
}