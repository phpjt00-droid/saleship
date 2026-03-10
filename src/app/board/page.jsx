import { Suspense } from 'react'
import Board from '../../views/Board'

export const metadata = {
  title: '핫딜 게시판 | 세일쉽 - 놓치면 아까운 세일즈 정보',
  description: '세일쉽 커뮤니티의 엄선된 최신 핫딜과 영업 노하우를 확인해 보세요.',
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Board...</div>}>
      <Board />
    </Suspense>
  )
}
