import React from 'react'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">고객 문의</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <input type="text" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="문의 제목을 입력하세요" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">내용</label>
            <textarea className="w-full p-2 border rounded-md h-32 dark:bg-gray-700 dark:border-gray-600" placeholder="문의 내용을 상세히 작성해 주세요"></textarea>
          </div>
          <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">문의하기</button>
        </form>
      </div>
    </div>
  )
}
