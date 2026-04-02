import { Metadata } from 'next'

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: InvoiceDetailPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `견적서 상세 - ${id}`,
    description: '견적서 상세 정보를 확인하고 PDF로 다운로드하세요',
  }
}

/**
 * 견적서 상세 페이지
 * 구현 기능: F001 (Notion 연동), F004 (상세 조회), F005 (PDF 다운로드),
 *           F011 (역할별 접근 제어), F012 (유효성 표시)
 */
export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">견적서 상세</h1>
        <p className="text-muted-foreground mt-2">견적서 ID: {id}</p>
      </div>

      {/* TODO: 견적서 상세 정보 컴포넌트 */}
      {/* TODO: PDF 다운로드 버튼 */}
      {/* TODO: 뒤로가기 버튼 */}

      <div className="text-muted-foreground flex items-center justify-center py-20">
        견적서 상세 기능 구현 예정
      </div>
    </div>
  )
}
