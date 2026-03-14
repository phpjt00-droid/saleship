'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarks } from '@/features/bookmarks/useBookmarks'
import DealCard from '@/components/DealCard'

export default function BookmarksPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { bookmarks, isLoading: bookmarksLoading } = useBookmarks()

  useEffect(() => {
    if (!authLoading && !user) {
      alert("로그인이 필요한 서비스입니다.");
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const isLoading = authLoading || bookmarksLoading

  return (
    <main className="container py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-4">My Bookmarks</h1>
        <p className="text-slate-500 font-medium">내가 찜한 핫딜을 한눈에 확인하세요.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-slate-100 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="text-6xl mb-6">🔖</div>
          <h3 className="text-xl font-black text-slate-900 mb-2">북마크가 비어있습니다.</h3>
          <p className="text-slate-500 font-bold">마음에 드는 핫딜을 북마크에 추가해보세요.</p>
        </div>
      )}
    </main>
  )
}
