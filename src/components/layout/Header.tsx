'use client';

// src/components/layout/Header.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const Header = () => {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* 로고 영역 */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/assets/anchor.svg" alt="Saleship" className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight">Saleship</span>
        </Link>

        {/* 메뉴 영역 */}
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/deals" className="hover:text-primary">핫딜</Link>
          <Link href="/community" className="hover:text-primary">커뮤니티</Link>
          <Link href="/bookmarks" className="hover:text-primary">북마크</Link>
          <Link href="/contact" className="hover:text-primary">문의하기</Link>
        </nav>

        {/* 유틸리티 영역 */}
        <div className="flex items-center gap-4">
          <input type="search" placeholder="검색..." className="hidden md:block border rounded-md px-3 py-1 text-sm" />
          <ThemeToggle />
          <div className="text-sm font-medium">
            {loading ? (
              " 확인 중..."
            ) : user ? (
              <span className="text-blue-600 font-bold">{user.nickname}님</span>
            ) : (
              <Link href="/login" className="hover:text-primary underline">로그인 필요</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};