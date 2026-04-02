import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '견적서 목록',
  description: '견적서 목록을 조회하고 검색하세요',
}

/**
 * 견적서 목록 페이지
 * 구현 기능: F001 (Notion 연동), F002 (목록 조회), F003 (검색/필터링),
 *           F011 (역할별 접근 제어), F012 (유효성 표시)
 */
export default function InvoicesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">견적서 목록</h1>
        <p className="text-muted-foreground mt-2">
          Notion에서 동기화된 견적서 목록입니다
        </p>
      </div>

      {/* TODO: 검색/필터 컴포넌트 */}
      {/* TODO: 견적서 목록 테이블 컴포넌트 */}
      {/* TODO: 페이지네이션 컴포넌트 */}

      <div className="text-muted-foreground flex items-center justify-center py-20">
        견적서 목록 기능 구현 예정
      </div>
    </div>
  )
}
