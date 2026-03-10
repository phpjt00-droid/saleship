import { Suspense } from 'react'
import Contact from '../../views/Contact'

export const metadata = {
  title: '문의하기 | 세일쉽 고객센터',
  description: '세일쉽 서비스 이용 관련 문의나 제휴 제안을 보내주세요.',
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Board...</div>}>
      <Board />
    </Suspense>
  )
}
