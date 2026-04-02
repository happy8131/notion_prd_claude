import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 미들웨어 - Supabase 세션 갱신 및 인증 라우팅 처리
 * 모든 요청에서 Supabase 세션 쿠키를 갱신하여 인증 상태를 최신으로 유지
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신 (getUser 호출 필수)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 공개 경로 (인증 불필요)
  const publicPaths = ['/login', '/signup']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // 미인증 사용자가 보호된 경로 접근 시 로그인 페이지로 리다이렉트
  if (!user && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 인증된 사용자가 로그인/회원가입 페이지 접근 시 견적서 목록으로 리다이렉트
  if (user && isPublicPath) {
    const invoicesUrl = new URL('/invoices', request.url)
    return NextResponse.redirect(invoicesUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 미들웨어 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico
     * - public 폴더 파일
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
