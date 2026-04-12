import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '견적서 관리',
}

/**
 * 관리자 견적서 목록 페이지 (Task 403에서 구현 예정)
 */
export default function AdminInvoicesPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">견적서 관리</h2>
        <p className="text-muted-foreground mt-1">
          전체 견적서를 조회하고 관리합니다
        </p>
      </div>
      {/* Task 403에서 AdminInvoiceTable 컴포넌트로 교체 예정 */}
      <p className="text-muted-foreground">견적서 목록을 불러오는 중...</p>
    </div>
  )
}
