'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="text-9xl mb-8">😵</div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">알 수 없는 오류가 발생했습니다.</h2>
      <p className="text-slate-500 dark:text-slate-400 font-bold mb-8">불편을 드려 죄송합니다. 잠시 후 다시 시도해 주세요.</p>
      <button
        onClick={() => reset()}
        className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-blue-200"
      >
        다시 시도하기
      </button>
    </div>
  );
}
