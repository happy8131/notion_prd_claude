import { Suspense } from 'react'
import type { Metadata } from 'next'
import { invoiceFilterSchema } from '@/lib/validations/invoice'
import { getInvoiceList } from '@/lib/notion/invoice-service'
import { InvoiceFilterBar } from '@/components/invoices/invoice-filter-bar'
import { AdminInvoiceTable } from '@/components/admin/admin-invoice-table'
import { InvoicePagination } from '@/components/invoices/invoice-pagination'
import { InvoiceListSkeleton } from '@/components/invoices/invoice-list-skeleton'
import { EmptyState } from '@/components/invoices/empty-state'

export const metadata: Metadata = {
  title: '견적서 관리',
}

interface AdminInvoicesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/**
 * 관리자 견적서 목록 페이지
 *
 * - 기존 InvoiceFilterBar 재사용 (basePath='/admin/invoices' 전달)
 * - AdminInvoiceTable로 공유 링크 복사 액션 컬럼 추가
 */
export default async function AdminInvoicesPage({
  searchParams,
}: AdminInvoicesPageProps) {
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
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">견적서 관리</h2>
        <p className="text-muted-foreground mt-1">
          전체 견적서를 조회하고 공유 링크를 관리합니다
        </p>
      </div>

      {/* 검색/필터 바 (basePath를 admin 경로로 지정) */}
      <InvoiceFilterBar
        defaultValues={parsed.success ? parsed.data : {}}
        basePath="/admin/invoices"
      />

      {/* 견적서 목록 테이블 */}
      <Suspense fallback={<InvoiceListSkeleton />}>
        {result.data.length === 0 ? (
          <EmptyState />
        ) : (
          <AdminInvoiceTable invoices={result.data} />
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
