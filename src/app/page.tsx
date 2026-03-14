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

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      if (authLoading) return;
      if (!user) {
        setIsChecking(false);
        return;
      }

      console.log("현재 로그인된 유저 ID:", user.id);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('nickname, gender, age')
        .eq('id', user.id)
        .single();

      console.log("DB 조회 결과:", { profile, error });

      // 프로필이 없거나 gender/age가 비어있으면 모달 표시
      if (error || !profile?.gender || !profile?.age) {
        console.log("데이터 미흡 -> 모달 표시");
        setShowOnboarding(true);
      } else {
        console.log("데이터 정상 -> 모달 숨김");
        setShowOnboarding(false);
      }
      setIsChecking(false);
    }

    checkProfile();
  }, [user, authLoading]);

  const handleOnboardingComplete = async (data: any) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        nickname: data.nickname,
        gender: data.gender,
        age: data.age
      })
      .eq('id', user?.id);

    if (error) {
      console.error('저장 에러:', error);
      alert('저장 중 오류가 발생했습니다.');
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

      <Hero />

      <div className="container mt-16 lg:mt-24">
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