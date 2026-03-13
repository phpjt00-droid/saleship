'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q');
    if (q) {
      router.push(`/deals?q=${encodeURIComponent(q as string)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/assets/anchor.svg" alt="Saleship" className="w-8 h-8 dark:invert" />
          <span className="font-bold text-xl tracking-tight">Saleship</span>
        </Link>

        {/* Nav Section */}
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/deals" className="hover:text-primary">핫딜</Link>
          <Link href="/community" className="hover:text-primary">커뮤니티</Link>
          <Link href="/bookmarks" className="hover:text-primary">북마크</Link>
          <Link href="/contact" className="hover:text-primary">문의하기</Link>
        </nav>

        {/* Utility Section */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch}>
            <input name="q" type="search" placeholder="검색..." className="hidden md:block border rounded-md px-3 py-1 text-sm bg-transparent outline-none focus:ring-2 focus:ring-blue-500/20 w-32 md:w-48 lg:w-64" />
          </form>
          <ThemeToggle />
          <div className="text-sm font-medium">
            {loading ? '...' : user ? user.nickname : <Link href="/login">로그인</Link>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
