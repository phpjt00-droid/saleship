import React from 'react'
import '../privacy/policy.css'

export const metadata = {
  title: '이용약관 | 세일쉽 - 핫딜 큐레이션 커뮤니티',
  description: '세일쉽 서비스 이용 약관을 안내해 드립니다.',
}

export default function TermsOfService() {
  return (
    <div className="policy-container">
      <h1>이용약관</h1>
      <p className="last-updated">최종 수정일: 2026년 3월 11일</p>
      
      <section>
        <h2>1. 목적</h2>
        <p>본 약관은 '세일쉽'이 제공하는 커뮤니티 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
      </section>

      <section>
        <h2>2. 게시물 관리</h2>
        <p>사용자는 타인의 저작권을 침해하거나 불법적인 내용을 게시해서는 안 됩니다. 정책 위반 시 게시물은 예고 없이 삭제될 수 있습니다.</p>
      </section>

      <section>
        <h2>3. 서비스의 변경 및 중단</h2>
        <p>'세일쉽'은 운영상, 기술상의 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.</p>
      </section>

      <section>
        <h2>4. 면책 조항</h2>
        <p>'세일쉽'은 사용자가 게시한 정보의 정확성이나 신뢰도에 대해 책임을 지지 않으며, 서비스 이용 중 발생하는 직간접적 손해에 대해 책임을 지지 않습니다.</p>
      </section>
    </div>
  )
}
