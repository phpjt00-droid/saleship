import { Suspense } from 'react'
import Contact from '../../views/Contact'

export default function Page() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>문의 페이지를 불러오는 중...</div>}>
      <Contact />
    </Suspense>
  )
}
