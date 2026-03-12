import { createBrowserClient } from '@supabase/ssr'

/**
 * 전역 Supabase 클라이언트 인스턴스
 * 클라이언트 컴포넌트와 서버 컴포넌트 모두에서 동작합니다.
 * 참고: 서버 컴포넌트에서 쿠키를 통한 인증 세션이 필요한 경우 createServerClient를 사용하는 것이 권장되지만,
 * 단순 데이터 조회나 클라이언트 사이드 인증에는 이 클라이언트를 재사용할 수 있습니다.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * 호출 시마다 새로운 클라이언트를 생성하는 함수
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
