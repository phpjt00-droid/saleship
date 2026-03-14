import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        // 서버 환경 변수에서 Supabase URL과 Key를 가져옵니다.
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 세션 교환
        await supabase.auth.exchangeCodeForSession(code);
    }

    // 성공 시 홈으로 리다이렉트
    return NextResponse.redirect(new URL('/', requestUrl.origin));
}