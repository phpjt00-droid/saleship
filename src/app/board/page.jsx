import { Suspense } from 'react'
import Board from '../../views/Board'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Board...</div>}>
      <Board />
    </Suspense>
  )
}
