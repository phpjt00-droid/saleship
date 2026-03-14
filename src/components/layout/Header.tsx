'use client';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Moon, Sun, User } from 'lucide-react'; // 아이콘 라이브러리 (설치되어 있다고 가정)

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
        {/* 로고 영역 */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/anchor-logo.png" alt="Saleship Logo" width={32} height={32} />
          <span className="text-xl font-bold text-gray-900">세일쉽</span>
        </Link>

        {/* 내비게이션 */}
        <nav className="flex items-center gap-8">
          <Link href="/deals" className="text-gray-600 hover:text-blue-600 font-medium">핫딜</Link>
          <Link href="/community" className="text-gray-600 hover:text-blue-600 font-medium">커뮤니티</Link>
          <Link href="/bookmarks" className="text-gray-600 hover:text-blue-600 font-medium">북마크</Link>
          <Link href="/support" className="text-gray-600 hover:text-blue-600 font-medium">문의하기</Link>
        </nav>

        {/* 우측 유틸리티 영역 */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input type="text" placeholder="검색..." className="px-3 py-1 text-sm border rounded-full focus:outline-none focus:border-blue-500" />
          </div>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"><Moon size={20} /></button>

          {loading ? (
            <span className="text-sm text-gray-400">...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/mypage" className="p-2 hover:bg-gray-100 rounded-full"><User size={20} /></Link>
              <span className="text-sm font-semibold text-blue-600">{user.nickname}님</span>
              <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-red-600 underline">로그아웃</button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
}