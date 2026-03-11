import { Suspense } from 'react'
import PostDetailWrapper from './PostDetailWrapper'

// SEO를 위한 동적 메타 데이터 생성
export async function generateMetadata({ params }) {
  const { id } = params
  
  // 실제 앱에서는 여기서 DB 조회를 하겠지만, 지금은 목데이타 기반으로 생성합니다.
  const titles = {
    '1': '[국내선/LF스퀘어몰] 챔피온 단독 브랜드 위크 (최대 ~90%)',
    '2': '[국내선/네이버스토어] 아로마티카 패밀리 세일 (최대 ~76%)',
    '3': '[국내선/네오팜] 아토팜 패밀리 세일 (최대 ~93%)',
    '4': '[국내선/크록스] 크록스 패밀리 세일 (최대 ~70%)',
    '5': '[국내선/기타] 헨켈 신학기 세일 위크 (최대 ~82%)'
  }

  const title = titles[id] || '핫딜 게시글'

  return {
    title: `${title} | 세일쉽 핫딜`,
    description: `${title}의 상세 할인 정보와 가격 변동 인사이트를 확인해 보세요.`,
    openGraph: {
      title: `${title} | 세일쉽 핫딜`,
      description: '세일쉽에서 선별한 양질의 핫딜 정보를 확인하세요.',
      type: 'article',
    }
  }
}

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ]
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center' }}>게시글을 불러오는 중...</div>}>
      <PostDetailWrapper />
    </Suspense>
  )
}
