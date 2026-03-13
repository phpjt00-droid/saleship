import React from 'react'
import Link from 'next/link'

export default function WritePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">글쓰기</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-300">새로운 글을 작성하는 공간입니다. 카테고리를 선택하여 글을 등록해 주세요.</p>
        <div className="mt-8 flex gap-4">
          <Link href="/admin/create-deal" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">핫딜 등록 (관리자)</Link>
          <Link href="/community/write" className="px-6 py-3 bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-200 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-gray-600 transition shadow-sm">커뮤니티 글쓰기</Link>
        </div>
      </div>
    </div>
  )
}
