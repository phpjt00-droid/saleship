'use client';

import { supabase } from '@/lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-primary">Saleship</Link>

        <div className="flex items-center gap-4">
          {loading ? (
            <span className="text-sm text-gray-400">...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-blue-600">{user.nickname}님</span>
              <button onClick={handleLogout} className="px-3 py-1 text-xs border rounded-md hover:bg-gray-100">로그아웃</button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 text-sm bg-primary text-white rounded-lg">로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
}