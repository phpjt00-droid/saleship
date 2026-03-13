'use client';

import Link from 'next/link';

export const Header = ({ user }) => (
  <header className="flex justify-between items-center p-4 bg-white border-b sticky top-0 z-50">
    <div className="font-bold text-xl text-blue-600">세일쉽(Saleship)</div>
    <nav className="flex gap-6">
      <Link href="/deal" className="hover:text-blue-600 transition-colors font-medium">핫딜</Link>
      <Link href="/community" className="hover:text-blue-600 transition-colors font-medium">커뮤니티</Link>
      <Link href="/bookmark" className="hover:text-blue-600 transition-colors font-medium">북마크</Link>
      <Link href="/contact" className="hover:text-blue-600 transition-colors font-medium">문의하기</Link>
    </nav>
  </header>
);

export default Header;
