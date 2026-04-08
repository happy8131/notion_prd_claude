import { redirect } from 'next/navigation'

/**
 * 루트 페이지 - 견적서 목록 페이지로 리다이렉트
 * Phase 1에서는 인증 불필요 (Notion API 직접 사용)
 */
export default function HomePage() {
  redirect('/invoices')
}
