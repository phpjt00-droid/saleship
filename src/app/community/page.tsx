import React from 'react'

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">커뮤니티 메인</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/community/free" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">자유게시판</h2>
          <p className="text-gray-600 dark:text-gray-300">자유로운 이야기를 나누는 공간입니다.</p>
        </a>
        <a href="/community/review" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">구매후기</h2>
          <p className="text-gray-600 dark:text-gray-300">내돈내산 생생한 후기를 확인하세요.</p>
        </a>
        <a href="/community/market" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">중고장터</h2>
          <p className="text-gray-600 dark:text-gray-300">필요한 물건을 사고 팔 수 있는 공간입니다.</p>
        </a>
      </div>
    </div>
  )
}
