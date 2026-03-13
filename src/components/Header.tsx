'use client';

import Link from 'next/link';

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="font-bold text-lg tracking-tight">세일쉽(Saleship)</div>
      <nav className="flex gap-6">
        <Link href="/deals" className="hover:text-blue-600 transition-colors">핫딜</Link>
        <Link href="/community" className="hover:text-blue-600 transition-colors">커뮤니티</Link>
        <Link href="/bookmarks" className="hover:text-blue-600 transition-colors">북마크</Link>
        <Link href="/contact" className="hover:text-blue-600 transition-colors">문의하기</Link>
      </nav>
    </header>
  );
};

export default Header;
