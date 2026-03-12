'use client'
import WritePost from '@/components/WritePost/WritePost'

export default function CreateDealPage() {
  return (
    <div className="container py-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-4 tracking-tighter">핫딜 등록</h1>
          <p className="text-slate-500 font-medium">새로운 핫딜 정보를 공유하여 커뮤니티에 기여하세요.</p>
        </div>
        <WritePost />
      </div>
    </div>
  )
}
