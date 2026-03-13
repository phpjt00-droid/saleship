'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Moon, Sun, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider/ThemeProvider';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  return (
    <header className="border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex justify-between items-center bg-transparent">
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="font-extrabold text-2xl tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              Saleship<span className="text-blue-600 group-hover:text-slate-900">.</span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-6">
          <Link href="/deals" className="text-sm font-black text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">핫딜</Link>
          <Link href="/community" className="text-sm font-black text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">커뮤니티</Link>
          <Link href="/bookmarks" className="text-sm font-black text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">북마크</Link>
          <Link href="/contact" className="text-sm font-black text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">문의하기</Link>
        </nav>

        {/* Right: Search + Utilities */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {/* Search Bar Slot */}
          <div className="relative hidden lg:block w-full max-w-[240px]">
            <input 
              type="text" 
              placeholder="검색..."
              className="w-full h-10 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold outline-none border border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-slate-700 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>

          {/* Utility Icons */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
              <Search size={20} />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {mounted && (isDark ? <Sun size={20} /> : <Moon size={20} />)}
            </button>
            <Link 
              href="/login" 
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              aria-label="Login"
            >
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
