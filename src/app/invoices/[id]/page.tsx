import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { InvoiceDetail } from '@/components/invoices/invoice-detail'
import { InvoiceItemsTable } from '@/components/invoices/invoice-items-table'
import { InvoiceSummary } from '@/components/invoices/invoice-summary'
import { PdfDownloadButton } from '@/components/invoices/pdf-download-button'
import { InvoicePdfTemplate } from '@/components/invoices/invoice-pdf-template'
import { getInvoiceById } from '@/lib/notion/invoice-service'
import { AlertCircle } from 'lucide-react'

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: InvoiceDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const invoice = await getInvoiceById(id)

  return {
    title: invoice ? `견적서 - ${invoice.invoiceNumber}` : '견적서 상세',
    description: invoice
      ? `${invoice.customerName}의 견적서 상세 정보`
      : '견적서 상세 정보를 확인하세요',
  }
}

/**
 * 견적서 상세 페이지
 * 구현 기능: F001 (Notion 연동), F004 (상세 조회), F005 (PDF 다운로드)
 */
export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params
  const invoice = await getInvoiceById(id)

  if (!invoice) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href="/invoices">
            <Button variant="outline" className="mb-4">
              ← 목록으로 돌아가기
            </Button>
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            요청하신 견적서를 찾을 수 없습니다.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* PDF 템플릿 (숨김) - html2canvas로 캡처용 */}
      <div className="absolute top-0 -left-[9999px]">
        <InvoicePdfTemplate invoice={invoice} />
      </div>

      {/* 헤더 */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">{invoice.invoiceNumber}</h1>
          <p className="text-muted-foreground mt-2">
            {invoice.customerName}의 견적서
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/invoices">
            <Button variant="outline">뒤로가기</Button>
          </Link>
          <PdfDownloadButton invoice={invoice}>PDF 다운로드</PdfDownloadButton>
        </div>
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
