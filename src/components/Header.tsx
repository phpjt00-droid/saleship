'use client';

import Link from 'next/link';
import { Bookmark } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="font-bold text-lg tracking-tight">세일쉽(Saleship)</div>
      <nav className="flex gap-6 items-center">
        <Link href="/deals" className="hover:text-blue-600 transition-colors font-bold">핫딜</Link>
        <Link href="/community" className="hover:text-blue-600 transition-colors font-bold">커뮤니티</Link>
        <Link href="/bookmarks" className="flex items-center gap-1 hover:text-blue-600 transition-colors font-bold">
          <Bookmark size={18} />
          Bookmarks
        </Link>
        <Link href="/contact" className="hover:text-blue-600 transition-colors font-bold">문의하기</Link>
      </nav>
    </header>
  );
};

export default Header;
