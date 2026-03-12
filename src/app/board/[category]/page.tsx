import { Suspense } from 'react'
import CategoryContent from './CategoryContent'

export function generateStaticParams() {
  return [
    { category: 'fashion' }, { category: 'food' }, { category: 'beauty' },
    { category: 'home' }, { category: 'electronics' }, { category: 'game' },
    { category: 'ticket' }, { category: 'offline' }, { category: 'trend' },
    { category: 'tips' }, { category: 'qna' }
  ]
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="container py-10 text-center text-slate-500">카테고리 불러오는 중...</div>}>
      <CategoryContent />
    </Suspense>
  )
}
