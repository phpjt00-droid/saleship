import React from 'react'
import '../privacy/policy.css'

export const metadata = {
  title: '이용 가이드 | Saleship - 커뮤니티 활용법',
  description: 'Saleship 커뮤니티를 200% 활용하는 방법을 안내해 드립니다.',
}

export default function GuidePage() {
  return (
    <div className="policy-container">
      <h1>⚓ Saleship 이용 가이드</h1>
      <p className="brand-intro">"처음 오셨나요? Saleship은 이렇게 이용하세요!"</p>
      
      <section>
        <h2>1. 핫딜 정보 확인</h2>
        <p>메인 화면과 핫딜 게시판에서 실시간으로 업데이트되는 핫딜 정보를 확인할 수 있습니다. 카테고리 필터를 사용하여 관심 있는 분야의 정보만 골라보세요.</p>
      </section>

      <section>
        <h2>2. 글쓰기 및 소통</h2>
        <p>로그인 후 우측 상단의 '글쓰기' 버튼을 통해 나만 아는 핫딜을 공유하거나, 자유게시판에서 다른 사용자들과 정보를 나눌 수 있습니다.</p>
      </section>

      <section>
        <h2>3. 추천 및 댓글</h2>
        <p>도움이 되는 정보에는 '좋아요'를 눌러 응원해 주세요. 궁금한 점은 댓글을 통해 질문하고 답변을 얻을 수 있습니다.</p>
      </section>
    </div>
  )
}
