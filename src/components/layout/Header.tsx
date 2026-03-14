'use client';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Moon, User, Search } from 'lucide-react';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${searchTerm}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* 로고 영역 */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/anchor-logo.png" alt="Saleship Logo" width={32} height={32} />
          <span className="text-xl font-bold text-gray-900">세일쉽</span>
        </Link>

        {/* 내비게이션 영역 */}
        <nav className="flex items-center gap-8">
          <Link href="/deals" className="text-gray-600 font-medium">핫딜</Link>
          <Link href="/community" className="text-gray-600 font-medium">커뮤니티</Link>
          <Link href="/bookmarks" className="text-gray-600 font-medium">북마크</Link>
          <Link href="/support" className="text-gray-600 font-medium">문의하기</Link>
        </nav>

        {/* 우측 유틸리티 영역 */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center border rounded-full px-3 py-1 bg-gray-50 focus-within:border-blue-500">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="검색..."
              className="outline-none text-sm w-32 bg-transparent"
            />
            <button onClick={handleSearch} className="ml-1 text-gray-400 hover:text-blue-600">
              <Search size={18} />
            </button>
          </div>

          <button onClick={() => alert("다크모드 기능 연동 필요")} className="p-2 text-gray-600">
            <Moon size={20} />
          </button>

          {loading ? (
            <span className="text-sm text-gray-400">...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="p-2 text-gray-600">
                <User size={20} />
              </Link>
              <span className="text-sm font-semibold">{user.nickname || '회원'}님</span>
              <button onClick={handleLogout} className="text-xs underline text-gray-500">
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}