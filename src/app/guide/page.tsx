export default function GuidePage() {
  return (
    <main className="container py-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black mb-12 text-center text-slate-900">User Guide</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
          <h3 className="text-2xl font-black mb-4">핫딜 이용 팁</h3>
          <p className="font-bold text-blue-100 leading-relaxed">
            게시물 하단의 구매 링크를 통해 직접 이동하실 수 있습니다. 쿠폰이나 카드 할인을 꼭 확인하세요!
          </p>
        </div>
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
          <h3 className="text-2xl font-black mb-4">커뮤니티 매너</h3>
          <p className="font-bold text-slate-400 leading-relaxed">
            존중과 배려가 가득한 커뮤니티를 지향합니다. 불법 광고나 혐오 표현은 제재 대상이 될 수 있습니다.
          </p>
        </div>
      </div>
    </main>
  )
}
