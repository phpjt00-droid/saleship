export default function FAQPage() {
  const faqs = [
    { q: '핫딜 정보는 어떻게 등록되나요?', a: '운영진과 유저들이 직접 선별한 최저가 정보를 공유합니다.' },
    { q: '허위 매물 신고는 어디서 하나요?', a: '문의하기 페이지를 통해 해당 링크와 함께 제보해 주세요.' },
    { q: '알림 설정을 할 수 있나요?', a: '현재 준비 중인 기능입니다. 곧 업데이트될 예정입니다.' }
  ]

  return (
    <main className="container py-20 px-4 max-w-3xl mx-auto">
      <h1 className="text-5xl font-black mb-12 text-center">FAQ</h1>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border hover:shadow-lg transition-all">
            <h3 className="text-xl font-black mb-4 flex items-start gap-3">
              <span className="text-blue-600">Q.</span> {faq.q}
            </h3>
            <p className="text-slate-500 font-bold leading-relaxed pl-8 border-l-4 border-slate-100">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
