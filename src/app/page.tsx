'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { generateNickname } from '@/utils/nicknameGenerator';
import OnboardingModal from '@/components/OnboardingModal';
import Hero from '@/components/Hero/Hero';
import LatestDealsClient from './LatestDealsClient';
import TrendingDealsClient from '@/components/PopularDeals/TrendingDealsClient';
import PopularDealsSidebar from '@/components/PopularDeals/PopularDealsSidebar';
import { useTab } from '@/context/TabContext';

// 상단 카테고리 스크롤바 컴포넌트
const CategoryScroll = ({ activeTab }: { activeTab: string }) => {
  const categories = {
    deals: ['전체', '가전', '패션', '식품', '취미'],
    community: ['자유게시판', '질문', '후기', '핫딜공유'],
    bookmarks: ['찜한 상품', '알림설정'],
    support: ['공지사항', '1:1문의']
  };

  const currentCategories = categories[activeTab as keyof typeof categories] || [];

  return (
    // 수정됨: md:hidden을 제거하고 md:block을 사용하여 데스크탑에서만 보이도록 설정
    <div className="hidden md:block sticky top-[68px] z-40 bg-[#f8fafc]/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 py-3">
      <div className="flex overflow-x-auto gap-2 px-6 scrollbar-hide">
        {currentCategories.map((cat) => (
          <button key={cat} className="whitespace-nowrap px-4 py-1.5 bg-white dark:bg-slate-800 rounded-full text-sm font-bold shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { activeTab } = useTab();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      if (authLoading) return;
      if (!user) {
        setIsChecking(false);
        return;
      }
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('nickname, gender, age')
        .eq('id', user.id)
        .single();

      if (error || !profile?.gender || !profile?.age) {
        setShowOnboarding(true);
      }
      setIsChecking(false);
    }
    checkProfile();
  }, [user, authLoading]);

  const handleOnboardingComplete = async (data: any) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        nickname: data.nickname,
        gender: data.gender,
        age: data.age
      });

    if (error) {
      alert('저장 중 오류가 발생했습니다: ' + error.message);
      return;
    }
    setShowOnboarding(false);
    window.location.reload();
  };

  if (isChecking) return <main className="min-h-screen bg-[#f8fafc]" />;

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-20">
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        initialNickname={user?.user_metadata?.full_name || generateNickname()}
      />

      {/* 이제 모바일에서 이 영역은 사라집니다 */}
      <CategoryScroll activeTab={activeTab} />

      <Hero />

      <div className="container mt-8 lg:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-20">
            <section>
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-8">
                <span className="w-2 h-8 bg-blue-600 rounded-full" />
                최신 핫딜
              </h2>
              <Suspense fallback={<div className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />}>
                <LatestDealsClient />
              </Suspense>
            </section>

            <section>
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-8">
                <span className="w-2 h-8 bg-rose-500 rounded-full" />
                인기 급상승
              </h2>
              <Suspense fallback={<div className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />}>
                <TrendingDealsClient />
              </Suspense>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="sticky top-24">
              <Suspense fallback={<div className="h-[600px] bg-slate-100 animate-pulse rounded-[2.5rem]" />}>
                <PopularDealsSidebar />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}