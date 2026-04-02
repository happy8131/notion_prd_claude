import { createBrowserClient } from '@supabase/ssr'

/**
 * 브라우저(클라이언트 컴포넌트)용 Supabase 클라이언트 생성
 * 클라이언트 컴포넌트에서 인증 상태 관리 및 실시간 데이터 구독에 사용
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
