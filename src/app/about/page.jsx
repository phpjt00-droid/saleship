import React from 'react'
import '../privacy/policy.css'

export const metadata = {
  title: '소개 | 세일쉽 - 세일즈 커뮤니티',
  description: '세일쉽 커뮤니티의 가치와 비전을 소개합니다.',
}

export default function AboutPage() {
  return (
    <div className="policy-container">
      <h1>세일쉽(Saleship) 소개</h1>
      <p className="brand-intro">"함께 성장하는 세일즈 전문 커뮤니티"</p>
      
      <section>
        <h2>⚓ 우리의 비전</h2>
        <p>세일쉽은 모든 세일즈맨과 마케터, 그리고 합리적인 소비를 지향하는 사람들이 모여 정보를 공유하고 함께 성장하는 공간입니다. 닻(Anchor)을 내리고 잠시 쉬어가며 더 먼 바다로 나아갈 에너지를 얻는 항구가 되고자 합니다.</p>
      </section>

      <section>
        <h2>⚓ 제공 서비스</h2>
        <ul>
          <li><strong>실시간 핫딜</strong>: 놓치기 아쉬운 고품질의 세일즈 정보를 가장 먼저 전달합니다.</li>
          <li><strong>자유 게시판</strong>: 현업의 고민과 노하우를 자유롭게 나눕니다.</li>
          <li><strong>사용 후기</strong>: 실제 경험을 바탕으로 한 진솔한 리뷰를 공유합니다.</li>
        </ul>
      </section>

      <section>
        <h2>⚓ 가치</h2>
        <p>우리는 신뢰할 수 있는 정보, 상호 존중하는 문화, 그리고 지속 가능한 성장을 최고의 가치로 삼습니다.</p>
      </section>
    </div>
  )
}
