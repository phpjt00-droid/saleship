import { Suspense } from 'react'
import Board from '../../views/Board'

export const metadata = {
  title: '자유게시판 | 세일쉽 - 소통하는 쇼핑 커뮤니티',
  description: '쇼핑에 대한 자유로운 이야기와 꿀팁을 나누는 공간입니다.',
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Board...</div>}>
      <Board />
    </Suspense>
  )
}
