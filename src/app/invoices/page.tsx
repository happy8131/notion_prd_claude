import { Suspense } from 'react'
import { Metadata } from 'next'
import { invoiceFilterSchema } from '@/lib/validations/invoice'
import { getInvoiceList } from '@/lib/notion/invoice-service'
import { InvoiceFilterBar } from '@/components/invoices/invoice-filter-bar'
import { InvoiceListTable } from '@/components/invoices/invoice-list-table'
import { InvoicePagination } from '@/components/invoices/invoice-pagination'
import { InvoiceListSkeleton } from '@/components/invoices/invoice-list-skeleton'
import { EmptyState } from '@/components/invoices/empty-state'

export const metadata: Metadata = {
  title: '견적서 목록',
  description: '견적서 목록을 조회하고 검색하세요',
}

interface InvoicesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/**
 * 견적서 목록 페이지
 *
 * 구현 기능: F001 (Notion 연동), F002 (목록 조회), F003 (검색/필터링)
 *
 * 서버 컴포넌트: searchParams를 async/await로 처리 (Next.js 15)
 * getInvoiceList()를 직접 호출하여 Notion에서 데이터 조회
 */
export default async function InvoicesPage({
  searchParams,
}: InvoicesPageProps) {
  const params = await searchParams

  // searchParams 파싱 및 검증
  const parsed = invoiceFilterSchema.safeParse({
    search: params.search,
    status: params.status,
    currency: params.currency,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  })

  // 페이지네이션 파라미터
  const page = Number(params.page) || 1
  const limit = 20

  // Notion에서 견적서 목록 조회
  const result = await getInvoiceList({
    ...(parsed.success ? parsed.data : {}),
    page,
    limit,
  })

  return (
    <div className="container mx-auto py-8">
      {/* 페이지 제목 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">견적서 목록</h1>
        <p className="text-muted-foreground mt-2">
          Notion에서 동기화된 견적서 목록입니다
        </p>
      </div>

      {/* 검색/필터 바 */}
      <InvoiceFilterBar defaultValues={parsed.success ? parsed.data : {}} />

      {/* 목록 테이블 */}
      <Suspense fallback={<InvoiceListSkeleton />}>
        {result.data.length === 0 ? (
          <EmptyState />
        ) : (
          <InvoiceListTable invoices={result.data} />
        )}
      </Suspense>

      {/* 페이지네이션 */}
      <InvoicePagination
        total={result.total}
        page={result.page}
        limit={result.limit}
      />
    </div>
  )
}
