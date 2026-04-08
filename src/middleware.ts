import { NextResponse } from 'next/server'

/**
 * Next.js 미들웨어 - 요청 통과 (인증 불필요)
 * Phase 1에서는 Notion API만 사용하므로 별도 인증 미들웨어 불필요
 */
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
