import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Currency } from '@/types'

interface InvoiceSummaryProps {
  subtotal: number
  tax?: number
  total: number
  currency: Currency
}

/**
 * 견적서 금액 요약 섹션 (소계, 세금, 총 금액)
 */
export function InvoiceSummary({
  subtotal,
  tax = 0,
  total,
  currency,
}: InvoiceSummaryProps) {
  const formatAmount = (amount: number): string => {
    if (currency === 'KRW') {
      return `₩${amount.toLocaleString('ko-KR')}`
    }
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>금액 요약</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* 소계 */}
          <div className="flex justify-between text-gray-700">
            <span>소계</span>
            <span>{formatAmount(subtotal)}</span>
          </div>

          {/* 세금 */}
          {tax > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>세금</span>
              <span>{formatAmount(tax)}</span>
            </div>
          )}

          <Separator />

          {/* 총 금액 */}
          <div className="flex justify-between pt-2 text-xl font-bold text-gray-900">
            <span>총 금액</span>
            <span className="text-blue-600">{formatAmount(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
