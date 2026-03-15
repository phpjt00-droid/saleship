'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarks } from '@/features/bookmarks/useBookmarks'
import DealCard from '@/components/DealCard'
import Image from 'next/image'

export default function BookmarksPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { bookmarks, isLoading: bookmarksLoading } = useBookmarks()

  const isLoading = authLoading || bookmarksLoading

  // 비회원 전용 로그인 안내 컴포넌트 (로그인 페이지와 일관성 유지)
  if (!authLoading && !user) {
    return (
      <main className="container py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24 mb-6">
          <Image src="/images/pingu-heart.png" alt="로그인 필요" fill className="object-contain" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">로그인이 필요합니다</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-center">
          북마크 기능을 이용하려면 로그인이 필요합니다.<br />
          간편하게 로그인하고 나만의 핫딜을 관리해보세요!
        </p>
        <button
          onClick={() => router.push('/login')}
          className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-all"
        >
          로그인하러 가기
        </button>
      </main>
    )
  }

  return (
    <main className="container py-8 md:py-12">
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
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Image
              src="/images/pingu-heart.png"
              alt="북마크 없음"
              fill
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