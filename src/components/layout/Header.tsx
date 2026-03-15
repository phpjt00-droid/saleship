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
    <header className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* 로고 영역 */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
            <Image
              src="/images/saleship-main.png"
              alt="Saleship Logo"
              fill
              priority
              sizes="40px"
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
            Saleship
          </span>
        </Link>

        {/* 네비게이션: 데스크탑(md)에서만 표시 */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { name: '핫딜', href: '/deals' },
            { name: '커뮤니티', href: '/community' },
            { name: '북마크', href: '/bookmarks' },
            { name: '문의하기', href: '/support' }
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-slate-600 dark:text-slate-400 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 우측 검색 및 유저 인터페이스 */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:flex items-center border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 bg-slate-50 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="관심 상품 검색..."
              className="outline-none text-sm w-32 md:w-40 bg-transparent dark:text-white placeholder:text-slate-400"
            />
            <button onClick={handleSearch} className="ml-1 text-slate-400 hover:text-blue-600 transition-colors">
              <Search size={16} />
            </button>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="테마 변경"
          >
            {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center border-l border-slate-200 dark:border-slate-700 ml-2 pl-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <User size={20} />
                </Link>
                <div className="hidden lg:flex flex-col items-start leading-tight">
                  <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">반가워요!</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {nickname || '회원'}님
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors ml-1"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 text-sm bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none active:scale-95 transition-all"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}