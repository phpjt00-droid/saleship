'use client';

import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-red-100">
      <Link href="/" className="text-xl font-bold text-primary">Saleship</Link>

      <div className="flex items-center gap-4">
        {/* 디버그용 텍스트 추가 */}
        <p className="text-[10px] text-red-500">
          DEBUG: loading={loading.toString()}, user={user ? '로그인됨' : '비회원'}
        </p>

        {loading ? (
          <span className="text-sm text-gray-400">불러오는 중...</span>
        ) : user ? (
          <span className="text-sm font-semibold text-blue-600">{user.nickname}님</span>
        ) : (
          <Link href="/login" className="px-4 py-2 text-sm bg-primary text-white rounded-lg">로그인</Link>
        )}
      </div>
    </header>
  );
}