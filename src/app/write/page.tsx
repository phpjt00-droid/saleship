import React from 'react'

export default function WritePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">글쓰기</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-300">새로운 글을 작성하는 공간입니다. 카테고리를 선택하여 글을 등록해 주세요.</p>
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">핫딜 등록</button>
          <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">커뮤니티 글쓰기</button>
        </div>
      </div>
    </div>
  )
}
