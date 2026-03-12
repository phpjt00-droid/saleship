import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// 정적 내보내기(output: export) 환경에서는 빌드 시 서버 사이드 세션(cookies) 접근이 불가능합니다.
// 따라서 서버용 클라이언트는 단순 데이터 조회용으로만 구성합니다.
export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
