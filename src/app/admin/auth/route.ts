import { NextRequest, NextResponse } from 'next/server'

/**
 * 관리자 인증 API
 * POST /admin/auth
 *
 * 요청: { password: string }
 * 응답: { success: boolean, message: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // 비밀번호 검증
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, message: '관리자 비밀번호가 설정되지 않았습니다' },
        { status: 500 }
      )
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: '비밀번호가 일치하지 않습니다' },
        { status: 401 }
      )
    }

    // 비밀번호 일치 - 쿠키 설정
    const response = NextResponse.json({ success: true, message: '인증 성공' })

    // 7일 동안 유효한 쿠키 설정
    response.cookies.set('admin_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
    })

    return response
  } catch (error) {
    console.error('인증 오류:', error)
    return NextResponse.json(
      { success: false, message: '인증 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
