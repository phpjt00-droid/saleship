'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 서비스(예: Sentry)에 에러 전송 가능
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={40} />
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
        문제가 발생했습니다
      </h1>
      
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-10 leading-relaxed">
        데이터를 불러오는 중 예상치 못한 오류가 발생했습니다. <br />
        잠시 후 다시 시도해 주세요.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-8 h-12 shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center gap-2"
        >
          <RefreshCcw size={18} />
          다시 시도하기
        </Button>
        
        <Link href="/">
          <Button 
            variant="outline" 
            size="lg"
            className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl px-8 h-12 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Home size={18} />
            홈으로 이동
          </Button>
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs text-slate-400 font-mono">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
