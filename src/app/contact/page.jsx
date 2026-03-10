import { Suspense } from 'react'
import Contact from '../../views/Contact'

export const metadata = {
  title: '문의하기 | 세일쉽 고객센터',
  description: '세일쉽 서비스 이용 관련 문의나 제휴 제안을 보내주세요.',
}

export default function Page() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>문의 페이지를 불러오는 중...</div>}>
      <Contact />
    </Suspense>
  )
}
