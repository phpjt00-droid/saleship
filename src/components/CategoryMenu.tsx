'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { LayoutGrid, Flame, Shirt, Utensils, Sparkles, Home as HomeIcon, Smartphone, Gamepad2, Ticket, MapPin } from 'lucide-react'

const categories = [
  { id: 'all', name: '전체', icon: LayoutGrid },
  { id: 'popular', name: '인기', icon: Flame },
  { id: 'fashion', name: '패션', icon: Shirt },
  { id: 'beauty', name: '뷰티', icon: Sparkles },
  { id: 'food', name: '식품', icon: Utensils },
  { id: 'living', name: '리빙', icon: HomeIcon },
  { id: 'tech', name: '테크', icon: Smartphone },
  { id: 'game', name: '게임', icon: Gamepad2 },
  { id: 'ticket', name: '상품권/이용권', icon: Ticket },
  { id: 'offline', name: '오프라인', icon: MapPin },
]

export default function CategoryMenu() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCat = searchParams.get('cat') || 'all'

  const handleCategoryClick = (catId: string) => {
    const params = new URLSearchParams(searchParams)
    if (catId === 'all') params.delete('cat')
    else params.set('cat', catId)
    router.push(`/deals?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap font-black text-sm transition-all active:scale-95 ${
            currentCat === cat.id
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 dark:shadow-none'
              : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-800'
          }`}
        >
          <cat.icon size={18} />
          {cat.name}
        </button>
      ))}
    </div>
  )
}
