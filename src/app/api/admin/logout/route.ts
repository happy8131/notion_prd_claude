import { NextResponse } from 'next/server'

/**
 * 관리자 로그아웃 API
 * POST /api/admin/logout
 *
 * admin_authenticated 쿠키를 삭제하여 로그아웃 처리
 * 응답: { success: boolean }
 */
export async function POST() {
  const response = NextResponse.json({ success: true })

  // admin_authenticated 쿠키를 만료시켜 삭제
  response.cookies.set('admin_authenticated', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // 즉시 만료
  })

  return response
}
