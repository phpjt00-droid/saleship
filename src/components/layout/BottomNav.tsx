'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Bookmark, HelpCircle } from 'lucide-react';
import { useTab } from '@/context/TabContext'; // 상태 관리를 위한 훅

export default function BottomNav() {
    const pathname = usePathname();
    const { setActiveTab } = useTab(); // 상태 업데이트 함수 가져오기

    const navItems = [
        { id: 'deals', name: '핫딜', href: '/deals', icon: Home },
        { id: 'community', name: '커뮤니티', href: '/community', icon: MessageSquare },
        { id: 'bookmarks', name: '북마크', href: '/bookmarks', icon: Bookmark },
        { id: 'support', name: '문의', href: '/support', icon: HelpCircle },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 px-6 py-3 flex justify-between items-center pb-safe">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setActiveTab(item.id)} // 클릭 시 전역 상태 업데이트
                        className="flex flex-col items-center gap-1"
                    >
                        <Icon
                            size={22}
                            className={isActive ? 'text-blue-600' : 'text-slate-400'}
                        />
                        <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}