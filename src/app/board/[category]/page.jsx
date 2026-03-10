import { Suspense } from 'react'
import Board from '../../../views/Board'

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
  ]
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Category...</div>}>
      <Board />
    </Suspense>
  )
}
