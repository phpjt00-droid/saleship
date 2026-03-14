// 인증 로직은 서버 환경에서만 작동해야 하므로 다이내믹 렌더링을 강제합니다.
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // 요청 URL에서 code 파라미터를 가져옵니다.
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        // Supabase 클라이언트를 초기화합니다. (환경 변수 사용)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 인증 코드를 세션으로 교환합니다.
        await supabase.auth.exchangeCodeForSession(code);
    }

    // 처리가 완료되면 메인 페이지로 리다이렉트합니다.
    return NextResponse.redirect(new URL('/', requestUrl.origin));
}