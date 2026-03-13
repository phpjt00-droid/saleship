export default function AboutPage() {
  return (
    <main className="container py-20 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-6xl font-black mb-6 tracking-tighter">About Saleship</h1>
        <p className="text-2xl text-slate-500 font-bold">취향과 가치를 담은 핫딜 큐레이션</p>
      </div>

      <div className="prose prose-slate max-w-none font-medium text-lg leading-relaxed text-slate-700">
        <p className="mb-8">
          Saleship은 넘쳐나는 정보 속에서 진짜 가치 있는 할인을 찾기 위해 시작되었습니다. 
          우리는 단순히 싼 물건을 찾는 것을 넘어, 똑똑하고 즐거운 쇼핑 경험을 지향합니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 not-prose mt-16 text-center">
          <div>
            <div className="text-4xl font-black text-blue-600 mb-2">Clean</div>
            <div className="font-bold text-slate-400">깨끗한 정보</div>
          </div>
          <div>
            <div className="text-4xl font-black text-rose-500 mb-2">Fast</div>
            <div className="font-bold text-slate-400">빠른 피드백</div>
          </div>
          <div>
            <div className="text-4xl font-black text-emerald-500 mb-2">Cool</div>
            <div className="font-bold text-slate-400">멋진 커뮤니티</div>
          </div>
        </div>
      </div>
    </main>
  )
}
