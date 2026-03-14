'use client';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          {/* 이미지 경로가 확실치 않다면 span으로 먼저 대체하여 로고 복구 */}
          <span className="text-xl font-bold text-gray-900">세일쉽</span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/deals" className="text-gray-600 hover:text-blue-600 font-medium">핫딜</Link>
          <Link href="/community" className="text-gray-600 hover:text-blue-600 font-medium">커뮤니티</Link>
          <Link href="/bookmarks" className="text-gray-600 hover:text-blue-600 font-medium">북마크</Link>
          <Link href="/support" className="text-gray-600 hover:text-blue-600 font-medium">문의하기</Link>
        </nav>

        <div className="flex items-center gap-4">
          {loading ? (
            <span className="text-sm text-gray-400">로딩 중...</span>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-blue-600">{user.nickname || '사용자'}님</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
}