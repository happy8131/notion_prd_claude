import { NextRequest, NextResponse } from 'next/server'

/**
 * Next.js 미들웨어
 * - /admin/* 경로: 관리자 비밀번호 인증 필요
 * - /share/* 경로: 공개 (인증 불필요)
 * - 기타 경로: 통과
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // /admin/* 경로 보호
  if (pathname.startsWith('/admin')) {
    // /admin/auth 경로는 통과 (로그인 페이지)
    if (pathname === '/admin/auth' || pathname.startsWith('/admin/auth/')) {
      return NextResponse.next()
    }

    // 관리자 쿠키 확인
    const adminAuth = request.cookies.get('admin_authenticated')
    if (!adminAuth) {
      // 인증되지 않으면 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/admin/auth', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
