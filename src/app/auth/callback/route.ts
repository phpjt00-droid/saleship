import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Cloudflare Edge Runtime 강제 설정
export const runtime = 'edge';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
        await supabase.auth.exchangeCodeForSession(code);
    }

    // URL을 절대 경로로 생성하여 리다이렉트
    return NextResponse.redirect(new URL('/', request.url));
}