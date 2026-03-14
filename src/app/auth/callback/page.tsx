'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleAuth = async () => {
            // 1. URL에 포함된 인증 코드를 세션으로 교환
            const { data, error } = await supabase.auth.getSession();

            if (data?.session) {
                // 2. 신규 유저인지 확인 (닉네임 설정 여부)
                const userNickname = data.session.user.user_metadata?.nickname;

                if (!userNickname) {
                    // 신규 유저라면 닉네임 설정 페이지로 (경로는 운영자님이 원하시는 대로 수정 가능)
                    router.push('/settings/profile');
                } else {
                    // 기존 유저라면 바로 홈으로
                    router.push('/');
                }
            } else if (error) {
                console.error('인증 처리 중 오류:', error.message);
                router.push('/login');
            }
        };

        handleAuth();
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">로그인 정보를 확인하고 있습니다...</p>
        </div>
    );
}