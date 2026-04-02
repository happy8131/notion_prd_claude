import { redirect } from 'next/navigation'

/**
 * 루트 페이지 - 로그인 페이지로 리다이렉트
 * 인증 미들웨어 설정 전 임시 리다이렉트
 * TODO: Supabase 인증 상태 확인 후 조건부 리다이렉트 구현
 *       - 로그인 상태: /invoices (견적서 목록)
 *       - 미로그인 상태: /login
 */
export default function HomePage() {
  redirect('/login')
}
