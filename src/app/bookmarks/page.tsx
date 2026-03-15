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

  // 비회원 전용 로그인 안내 컴포넌트 (카드 스타일로 업그레이드)
  if (!authLoading && !user) {
    return (
      <main className="container py-20 flex justify-center">
        <div className="w-full max-w-lg bg-slate-900 dark:bg-slate-900 border border-slate-800 p-12 rounded-[2.5rem] text-center shadow-2xl">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <Image src="/images/pingu-heart.png" alt="로그인 필요" fill className="object-contain" />
          </div>
          <h3 className="text-3xl font-black text-white mb-4">찜한 핫딜을 모아보세요</h3>
          <p className="text-slate-400 font-medium mb-8">
            로그인하시면 마음에 드는 핫딜을 저장하고<br />
            나중에 다시 간편하게 확인할 수 있습니다.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all"
          >
            구글로 1초 로그인
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image src="/images/pingu-heart.png" alt="북마크 펭귄" fill priority sizes="64px" className="object-contain" />
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
        // 북마크가 비어있는 경우에도 로그인 안내와 일관된 카드 스타일 적용
        <div className="py-20 flex justify-center">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-12 rounded-[2.5rem] text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <Image src="/images/pingu-heart.png" alt="북마크 없음" fill className="object-contain opacity-50" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">북마크가 비어있습니다.</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-6">
              아직 북마크한 핫딜이 없습니다. <br />
              마음에 드는 핫딜을 찾아 저장해보세요!
            </p>
            <button
              onClick={() => router.push('/deals')}
              className="px-8 py-3 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-2xl hover:opacity-90 transition-all"
            >
              핫딜 구경하러 가기
            </button>
          </div>
        </div>
      )}
    </main>
  )
}