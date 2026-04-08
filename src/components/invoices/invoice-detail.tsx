import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { InvoiceStatusBadge } from './invoice-status-badge'
import type { Invoice } from '@/types'

interface InvoiceDetailProps {
  invoice: Invoice
}

/**
 * 견적서 기본 정보 및 고객 정보를 표시하는 컴포넌트
 */
export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      {/* 기본 정보 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-600">견적서 번호</p>
              <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">상태</p>
              <div className="mt-1">
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">발행일</p>
              <p className="text-lg font-semibold">
                {formatDate(invoice.createdDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">유효기간</p>
              <p className="text-lg font-semibold">
                {formatDate(invoice.expiryDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 고객 정보 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>고객 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600">고객명</p>
              <p className="text-lg font-semibold">{invoice.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">이메일</p>
              <p className="text-lg font-semibold">
                {invoice.customerEmail || '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 비고 섹션 */}
      {invoice.notes && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle>비고</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700">
                {invoice.notes}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
