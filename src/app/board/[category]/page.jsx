import { Suspense } from 'react'
import Board from '@/components/views/Board'

export function generateStaticParams() {
  return [
    { category: 'fashion' },
    { category: 'food' },
    { category: 'beauty' },
    { category: 'home' },
    { category: 'electronics' },
    { category: 'game' },
    { category: 'ticket' },
    { category: 'offline' },
    { category: 'trend' },
    { category: 'tips' },
    { category: 'qna' },
  ]
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Category...</div>}>
      <Board />
    </Suspense>
  )
}
