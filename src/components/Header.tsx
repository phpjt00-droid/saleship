'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bookmark } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="font-bold text-xl tracking-tight text-slate-900">세일쉽(Saleship)</div>
        </Link>
        <nav className="flex gap-8 items-center">
          <Link href="/deals" className="text-slate-600 hover:text-blue-600 transition-colors font-bold">핫딜</Link>
          <Link href="/community" className="text-slate-600 hover:text-blue-600 transition-colors font-bold">커뮤니티</Link>
          <Link href="/bookmarks" className="text-slate-600 hover:text-blue-600 transition-colors font-bold">북마크</Link>
          <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors font-bold">문의하기</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
