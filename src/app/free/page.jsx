import { Suspense } from 'react'
import Board from '../../views/Board'

export const metadata = {
  title: '자유게시판 | 세일쉽 - 소통하는 세일즈 커뮤니티',
  description: '세일즈에 대한 자유로운 이야기와 고민을 나누는 공간입니다.',
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Board...</div>}>
      <Board />
    </Suspense>
  )
}
