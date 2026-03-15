'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarks } from '@/features/bookmarks/useBookmarks'
import DealCard from '@/components/DealCard'
import Image from 'next/image'

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
    <main className="container py-8 md:py-12">
      {/* 헤더 레이아웃 통일 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src="/images/pingu-heart.png"
              alt="북마크 펭귄"
              fill
              priority
              sizes="64px"
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 dark:text-white">북마크</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">찜해둔 핫딜을 한눈에 확인하세요.</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2.5rem]" />
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
          {/* 비어있을 때 이미지 컨테이너 */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Image
              src="/images/pingu-heart.png"
              alt="북마크 없음"
              fill
              sizes="80px"
              className="object-contain opacity-80"
            />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">북마크가 비어있습니다.</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold">
            아직 북마크한 핫딜이 없습니다. 마음에 드는 핫딜을 추가해보세요.
          </p>
        </div>
      )}
    </main>
  )
}