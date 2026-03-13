'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const categories = [
  { id: '', name: '전체' },
  { id: 'popular', name: '실적/인기' },
  { id: 'fashion', name: '패션' },
  { id: 'beauty', name: '뷰티' },
  { id: 'food', name: '푸드' },
  { id: 'living', name: '리빙' },
  { id: 'tech', name: '테크' },
  { id: 'game', name: '게임' },
  { id: 'voucher', name: '상품권' },
  { id: 'offline', name: '오프라인' },
]

export default function CategoryMenu() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCat = searchParams.get('cat') || ''

  const handleCategoryClick = (id: string) => {
    const params = new URLSearchParams(searchParams)
    if (id) params.set('cat', id)
    else params.delete('cat')
    
    router.push(`/deal?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            currentCat === cat.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'bg-white text-slate-600 border border-slate-100 hover:border-blue-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
