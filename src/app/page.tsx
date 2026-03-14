'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import OnboardingModal from '@/components/OnboardingModal';
import Hero from '@/components/Hero/Hero';
import LatestDealsClient from './LatestDealsClient';
import TrendingDealsClient from '@/components/PopularDeals/TrendingDealsClient';
import PopularDealsSidebar from '@/components/PopularDeals/PopularDealsSidebar';

export default function HomePage() {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      // 로딩 중이거나 유저 정보가 없으면 체크하지 않음
      if (loading || !user) return;

      // DB에서 직접 해당 유저의 프로필 데이터를 조회
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('gender, age')
        .eq('id', user.id)
        .single();

      // 에러가 발생하거나 데이터가 부족하면 모달을 띄움
      if (error || !profile?.gender || !profile?.age) {
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    }

    checkProfile();
  }, [user, loading]);

  const handleOnboardingComplete = async (data: any) => {
    // Supabase profiles 테이블 업데이트
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
    window.location.reload(); // 성공 시 새로고침
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-20">
      {/* 신규 회원 온보딩 모달 */}
      <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />

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
              <Suspense fallback={<div className="h-[600px] bg-slate-