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
      // 로그아웃 성공 시 로컬 데이터를 날리고 로그인 페이지로 강제 이동
      router.push('/login');
      router.refresh(); // 세션 상태를 완전히 새로고침
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
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
            {/* 닉네임 표시 */}
            <span className="text-sm font-semibold text-blue-600">
              {user.nickname}님
            </span>
            {/* 로그아웃 버튼 */}
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
    </header>
  );
}