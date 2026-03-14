'use client';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes'; // 추가
import { Moon, Sun, User, Search } from 'lucide-react'; // Sun 아이콘 추가

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, setTheme } = useTheme(); // 테마 상태 관리
  const [mounted, setMounted] = useState(false); // Hydration 방지

  // 컴포넌트가 마운트된 후 테마 사용 가능
  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/deals?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/anchor-logo.png" alt="Saleship Logo" width={32} height={32} />
          <span className="text-xl font-bold text-gray-900 dark:text-white">세일쉽</span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/deals" className="text-gray-600 dark:text-gray-300 font-medium">핫딜</Link>
          <Link href="/community" className="text-gray-600 dark:text-gray-300 font-medium">커뮤니티</Link>
          <Link href="/bookmarks" className="text-gray-600 dark:text-gray-300 font-medium">북마크</Link>
          <Link href="/support" className="text-gray-600 dark:text-gray-300 font-medium">문의하기</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center border rounded-full px-3 py-1 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="검색..."
              className="outline-none text-sm w-32 bg-transparent dark:text-white"
            />
            <button onClick={handleSearch} className="ml-1 text-gray-400 hover:text-blue-600">
              <Search size={18} />
            </button>
          </div>

          {/* 다크모드 버튼 실제 동작 */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {loading ? (
            <span className="text-sm text-gray-400">...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="p-2 text-gray-600 dark:text-gray-300">
                <User size={20} />
              </Link>
              <span className="text-sm font-semibold dark:text-white">{user.nickname || '회원'}님</span>
              <button onClick={handleLogout} className="text-xs underline text-gray-500 dark:text-gray-400">
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