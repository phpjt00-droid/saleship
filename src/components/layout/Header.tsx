'use client';

import { supabase } from '@/lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('로그아웃 중 오류가 발생했습니다.');
    } else {
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <header className="border-b bg-white">
      {/* max-w-7xl, mx-auto를 사용하여 중앙 정렬 및 너비 제한 */}
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        {/* 로고 영역 */}
        <Link href="/" className="text-xl font-bold text-primary">
          Saleship
        </Link>

        {/* 우측 메뉴 영역 */}
        <div className="flex items-center gap-4">
          {loading ? (
            <span className="text-sm text-gray-400">불러오는 중...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-blue-600">
                {user.nickname}님
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-xs border rounded-md hover:bg-gray-100 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}