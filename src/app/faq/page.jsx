import React from 'react'
import '../privacy/policy.css'

export const metadata = {
  title: '자주 묻는 질문 | Saleship 고객센터',
  description: 'Saleship 이용에 대해 자주 묻는 질문들을 모았습니다.',
}

export default function FaqPage() {
  return (
    <div className="policy-container">
      <h1>⚓ 자주 묻는 질문 (FAQ)</h1>
      
      <section>
        <h2>Q. Saleship은 어떤 사이트인가요?</h2>
        <p>A. 무분별한 정보 속에서 양질의 핫딜만을 큐레이션하여 공유하는 스마트 소비자를 위한 커뮤니티입니다.</p>
      </section>

      <section>
        <h2>Q. 회원가입은 유료인가요?</h2>
        <p>A. 아닙니다. Saleship의 모든 기본 서비스와 커뮤니티 참여는 무료입니다.</p>
      </section>

      <section>
        <h2>Q. 광고를 게재하고 싶습니다.</h2>
        <p>A. 문의하기 페이지를 통해 제휴 제안을 보내주시면 담당자가 확인 후 연락드리겠습니다.</p>
      </section>
    </div>
  )
}
