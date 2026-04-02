import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 서버(서버 컴포넌트 / Route Handler)용 Supabase 클라이언트 생성
 * Next.js 쿠키를 통한 세션 관리로 SSR에서 인증 상태 유지
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 서버 컴포넌트에서 쿠키 설정 시도 시 무시 (읽기 전용 컨텍스트)
          }
        },
      },
    }
  )
}
