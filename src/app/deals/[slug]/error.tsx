'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container py-32 text-center">
      <div className="max-w-md mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700/60">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">앗! 문제가 발생했습니다</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          게시글을 불러오는 중에 오류가 발생했습니다.<br />
          잠시 후 다시 시도해 주세요.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <RotateCcw size={18} />
            다시 시도하기
          </button>
          <Link
            href="/"
            className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Home size={18} />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
