import React from 'react'
import './policy.css'

export const metadata = {
  title: '개인정보처리방침 | 세일쉽 - 세일즈 커뮤니티',
  description: '세일쉽의 개인정보 처리 방침을 안내해 드립니다.',
}

export default function PrivacyPolicy() {
  return (
    <div className="policy-container">
      <h1>개인정보처리방침</h1>
      <p className="last-updated">최종 수정일: 2026년 3월 11일</p>
      
      <section>
        <h2>1. 수집하는 개인정보 항목</h2>
        <p>'세일쉽'은 사용자의 서비스 이용 과정에서 다음과 같은 정보가 자동으로 생성되어 수집될 수 있습니다.</p>
        <ul>
          <li>IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록</li>
          <li>Google Analytics 및 Microsoft Clarity를 통한 익명의 행동 분석 데이터</li>
        </ul>
      </section>

      <section>
        <h2>2. 개인정보의 수집 및 이용 목적</h2>
        <p>수집된 정보는 다음의 목적을 위해 활용됩니다.</p>
        <ul>
          <li>서비스 제공 및 콘텐츠 최적화</li>
          <li>사용자 행동 분석 및 서비스 개선</li>
          <li>구글 애드센스 광고 게재 및 최적화</li>
        </ul>
      </section>

      <section>
        <h2>3. 개인정보의 보유 및 이용 기간</h2>
        <p>원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 일정 기간 보관합니다.</p>
      </section>

      <section>
        <h2>4. 제3자에게의 정보 제공</h2>
        <p>'세일쉽'은 사용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만, 구글(Google) 및 마이크로소프트(Microsoft)와 같은 서비스 제공업체에 데이터 분석을 위한 익명화된 정보가 제공될 수 있습니다.</p>
      </section>

      <section>
        <h2>5. 쿠키(Cookie)의 운용 및 거부</h2>
        <p>사용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹 브라우저 설정에서 쿠키를 허용하거나 거부할 수 있습니다.</p>
      </section>
    </div>
  )
}
