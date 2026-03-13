'use client';

import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/security';

interface WriteButtonProps {
  user: any;
  pageType: 'hotdeals' | 'community';
}

export const WriteButton = ({ user, pageType }: WriteButtonProps) => {
  const router = useRouter();

  // 핫딜 페이지이면서 관리자인 경우
  if (pageType === 'hotdeals' && isAdmin(user?.email)) {
    return (
      <button 
        onClick={() => router.push('/admin/post')}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
      >
        핫딜 등록
      </button>
    );
  }
  
  // 커뮤니티 페이지이면서 로그인한 경우
  if (pageType === 'community' && user) {
    return (
      <button 
        onClick={() => router.push('/community/write')}
        className="px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-xl shadow-lg transition-all active:scale-95"
      >
        글쓰기
      </button>
    );
  }

  return null;
};

export default WriteButton;
