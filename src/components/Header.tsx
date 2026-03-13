'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bookmark } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative w-8 h-8 overflow-hidden rounded-lg">
          <Image 
            src="/images/pingu-hello.png" 
            alt="Pingu" 
            fill
            className="object-contain group-hover:scale-110 transition-transform"
          />
        </div>
        <div className="font-bold text-lg tracking-tight">세일쉽(Saleship)</div>
      </Link>
      <nav className="flex gap-6 items-center">
        <Link href="/deals" className="hover:text-blue-600 transition-colors font-bold">핫딜</Link>
        <Link href="/community" className="hover:text-blue-600 transition-colors font-bold">커뮤니티</Link>
        <Link href="/bookmarks" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-bold group">
          <div className="relative w-5 h-5">
            <Image 
              src="/images/pingu-love.png" 
              alt="Bookmarks" 
              fill
              className="object-contain group-hover:animate-bounce"
            />
          </div>
          북마크
        </Link>
        <Link href="/contact" className="hover:text-blue-600 transition-colors font-bold">문의하기</Link>
      </nav>
    </header>
  );
};

export default Header;
