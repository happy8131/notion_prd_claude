import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { InvoiceStatusBadge } from '@/components/invoices/invoice-status-badge'
import { CopyShareLinkButton } from './copy-share-link-button'
import type { Invoice } from '@/types'

/**
 * 금액을 통화 단위에 맞게 포맷
 */
function formatAmount(amount: number, currency: 'KRW' | 'USD'): string {
  if (currency === 'KRW') {
    return `₩${amount.toLocaleString('ko-KR')}`
  }
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * 날짜를 한국어 형식으로 포맷
 */
function formatDate(dateStr: string): string {
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

/**
 * 유효기간이 만료되었는지 확인
 */
function isExpired(expiryDate: string, status: string): boolean {
  if (!expiryDate || status === 'ACCEPTED') return false
  return new Date(expiryDate) < new Date()
}

/**
 * 관리자 전용 견적서 목록 테이블
 * 기본 InvoiceListTable 기능 + 공유 링크 복사 버튼 액션 컬럼 추가
 */
export function AdminInvoiceTable({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return null
  }

  return (
    <div className="border-border rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="h-12 font-semibold">견적서 번호</TableHead>
            <TableHead className="h-12 font-semibold">고객명</TableHead>
            <TableHead className="h-12 text-right font-semibold">
              금액
            </TableHead>
            <TableHead className="h-12 font-semibold">상태</TableHead>
            <TableHead className="h-12 font-semibold">발행일</TableHead>
            <TableHead className="h-12 font-semibold">유효기간</TableHead>
            {/* 관리자 전용 액션 컬럼 */}
            <TableHead className="h-12 font-semibold">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(invoice => {
            const expired = isExpired(invoice.expiryDate, invoice.status)

            return (
              <TableRow key={invoice.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-blue-600">
                  <Link
                    href={`/admin/invoices/${invoice.id}`}
                    className="hover:underline"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell className="text-right">
                  {formatAmount(invoice.totalAmount, invoice.currency)}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
                <TableCell>{formatDate(invoice.createdDate)}</TableCell>
                <TableCell
                  className={expired ? 'text-red-500 line-through' : ''}
                >
                  {formatDate(invoice.expiryDate)}
                </TableCell>
                {/* 공유 링크 복사 버튼 */}
                <TableCell>
                  <CopyShareLinkButton invoiceId={invoice.id} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
