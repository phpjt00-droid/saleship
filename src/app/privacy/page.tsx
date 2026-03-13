export default function PrivacyPage() {
  return (
    <main className="container py-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black mb-12">Privacy Policy</h1>
      <div className="bg-white p-12 rounded-[3rem] border shadow-sm space-y-8 font-medium text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4">개인정보 수집 및 항목</h2>
          <p>회사는 서비스 제공을 위해 이메일, 닉네임 등의 최소한의 정보를 수집합니다.</p>
        </section>
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4">개인정보의 파기</h2>
          <p>수집된 개인정보는 목적 달성 후 지체 없이 파기하며, 관계 법령에 따라 보안을 유지합니다.</p>
        </section>
        <p className="pt-8 text-sm text-slate-400 font-bold">최종 수정일: 2026년 3월 13일</p>
      </div>
    </main>
  )
}
