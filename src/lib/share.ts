/**
 * 견적서 공유 URL 생성 유틸리티
 */

/**
 * 특정 견적서의 공유 URL을 생성
 * - 서버 환경: NEXT_PUBLIC_BASE_URL 환경변수 사용
 * - 클라이언트 환경: window.location.origin 사용 (폴백)
 *
 * @param invoiceId 견적서 ID (Notion 페이지 ID)
 * @returns 공유 URL (예: https://example.com/share/invoices/abc123)
 */
export function getShareUrl(invoiceId: string): string {
  // 클라이언트 환경에서 window.location.origin 사용
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (typeof window !== 'undefined' ? window.location.origin : '')
  return `${baseUrl}/share/invoices/${invoiceId}`
}
