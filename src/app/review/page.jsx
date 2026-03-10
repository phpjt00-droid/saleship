import { Suspense } from 'react'
import Board from '../../views/Board'

export const metadata = {
  title: '리뷰게시판 | 세일쉽 - 진솔한 사용 후기',
  description: '직접 구매하고 사용해본 다양한 상품들의 솔직한 후기를 공유합니다.',
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Board...</div>}>
      <Board />
    </Suspense>
  )
}
