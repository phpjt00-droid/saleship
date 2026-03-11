import React from 'react'
import '../privacy/policy.css'

export const metadata = {
  title: '소개 | 세일쉽 - 핫딜 큐레이션 커뮤니티',
  description: '세일쉽이 추구하는 최고의 핫딜 큐레이션 가치를 소개합니다.',
}

export default function AboutPage() {
  return (
    <div className="policy-container">
      <h1>세일쉽(Saleship) 소개</h1>
      <p className="brand-intro">"소비자를 위한 스마트한 핫딜 큐레이션"</p>
      
      <section>
        <h2>⚓ 우리의 비전</h2>
        <p>세일쉽은 무분별하게 쏟아지는 정보 속에서 소비자들에게 정말 가치 있는 **'양질의 핫딜'**만을 선별하여 공유하는 커뮤니티입니다. 단순히 싼 물건을 찾는 것을 넘어, 합리적인 소비 생활을 정착시키고 즐거운 쇼핑 경험을 나누는 항구가 되고자 합니다.</p>
      </section>

      <section>
        <h2>⚓ 제공 서비스</h2>
        <ul>
          <li><strong>엄선된 핫딜</strong>: 광고성 정보가 아닌, 실제 혜택이 큰 고품질 핫딜 정보를 큐레이션하여 제공합니다.</li>
          <li><strong>쇼핑 커뮤니티</strong>: 실제 구매 경험과 노하우를 공유하며 함께 현명한 소비를 실천합니다.</li>
          <li><strong>정직한 리뷰</strong>: 사용자들의 진솔한 후기를 통해 제품의 가치를 정확하게 파악합니다.</li>
        </ul>
      </section>

      <section>
        <h2>⚓ 우리의 가치</h2>
        <p>우리는 투명한 정보 공유, 신뢰할 수 있는 큐레이션, 그리고 건강한 소비 문화를 최고의 가치로 삼습니다.</p>
      </section>
    </div>
  )
}
