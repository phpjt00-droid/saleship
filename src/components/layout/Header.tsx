'use client';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, User, Search } from 'lucide-react';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function fetchNickname() {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', user.id)
        .single();
      if (data?.nickname) setNickname(data.nickname);
    }
    fetchNickname();
  }, [user]);

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
    <header className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* 로고 부분 - 레이아웃 통일 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/images/anchor-logo.png" alt="Saleship Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">세일쉽</span>
        </Link>

        {/* 네비게이션 - 디자인 시스템 반영 */}
        <nav className="flex items-center gap-8">
          {['핫딜', '커뮤니티', '북마크', '문의하기'].map((item, i) => (
            <Link
              key={item}
              href={['/deals', '/community', '/bookmarks', '/support'][i]}
              className="text-slate-600 dark:text-slate-400 font-bold hover:text-blue-600 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* 우측 검색 및 유저 영역 */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 bg-slate-50 dark:bg-slate-800">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="검색..."
              className="outline-none text-sm w-32 bg-transparent dark:text-white placeholder:text-slate-400"
            />
            <button onClick={handleSearch} className="ml-1 text-slate-400 hover:text-blue-600">
              <Search size={18} />
            </button>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {loading ? (
            <span className="text-sm text-slate-400">...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="p-2 text-slate-600 dark:text-slate-400">
                <User size={20} />
              </Link>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {nickname || '회원'}님
              </span>
              <button onClick={handleLogout} className="text-xs underline text-slate-500 dark:text-slate-400">
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 text-sm bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}