import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getInvoiceById } from '@/lib/notion/invoice-service'
import { InvoiceDetail } from '@/components/invoices/invoice-detail'
import { InvoiceItemsTable } from '@/components/invoices/invoice-items-table'
import { InvoiceSummary } from '@/components/invoices/invoice-summary'
import { InvoicePdfTemplate } from '@/components/invoices/invoice-pdf-template'
import { PdfDownloadButton } from '@/components/invoices/pdf-download-button'
import { Separator } from '@/components/ui/separator'

interface ShareInvoicePageProps {
  params: Promise<{ id: string }>
}

/**
 * 공유 견적서 메타데이터 생성
 * OG 태그 포함으로 소셜 공유 시 미리보기 지원
 */
export async function generateMetadata({
  params,
}: ShareInvoicePageProps): Promise<Metadata> {
  const { id } = await params
  const invoice = await getInvoiceById(id)

  if (!invoice) {
    return {
      title: '견적서를 찾을 수 없습니다',
    }
  }

  const title = `견적서 ${invoice.invoiceNumber} - ${invoice.customerName}`
  const description = `${invoice.customerName}의 견적서입니다. 발행일: ${invoice.createdDate}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

/**
 * 공유 전용 견적서 상세 페이지
 *
 * - 인증 없이 공개 접근 가능 (현재 미들웨어 pass-through)
 * - 기존 컴포넌트(InvoiceDetail, InvoiceItemsTable, InvoiceSummary, PdfDownloadButton) 재사용
 * - TODO: 향후 인증 연동 시 미들웨어에서 /share/** 경로 예외 처리 필요
 */
export default async function ShareInvoicePage({
  params,
}: ShareInvoicePageProps) {
  const { id } = await params
  const invoice = await getInvoiceById(id)

  // 존재하지 않는 견적서는 404 처리
  if (!invoice) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      {/* PDF 템플릿 (숨김) - html2canvas 캡처용 */}
      <div style={{ position: 'absolute', top: 0, left: '-9999px' }}>
        <InvoicePdfTemplate invoice={invoice} />
      </div>

      {/* 공유 페이지 헤더 */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">{invoice.invoiceNumber}</h1>
          <p className="text-muted-foreground mt-2">
            {invoice.customerName}의 견적서
          </p>
        </div>

        {/* PDF 다운로드 버튼 */}
        <PdfDownloadButton invoice={invoice}>PDF 다운로드</PdfDownloadButton>
      </div>

      <Separator className="mb-8" />

      {/* 기본 정보 및 고객 정보 */}
      <InvoiceDetail invoice={invoice} />

      <Separator className="my-8" />

      {/* 상품 목록 */}
      <InvoiceItemsTable items={invoice.items || []} />

      <Separator className="my-8" />

      {/* 금액 요약 */}
      <div className="max-w-lg">
        <InvoiceSummary
          subtotal={invoice.totalAmount}
          tax={0}
          total={invoice.totalAmount}
          currency={invoice.currency}
        />
      </div>
    </div>
  )
}
