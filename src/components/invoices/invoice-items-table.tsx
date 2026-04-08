import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { InvoiceItem } from '@/types'

interface InvoiceItemsTableProps {
  items: InvoiceItem[]
}

/**
 * 견적서 상품 목록을 테이블 형식으로 표시하는 컴포넌트
 */
export function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  if (!items || items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>상품 목록</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-500">
          상품 정보가 없습니다.
        </CardContent>
      </Card>
    )
  }

  const formatAmount = (amount: number): string => {
    return `₩${amount.toLocaleString('ko-KR')}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>상품 목록</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">상품명</TableHead>
              <TableHead className="text-right font-semibold">수량</TableHead>
              <TableHead className="text-right font-semibold">단가</TableHead>
              <TableHead className="text-right font-semibold">합계</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{item.itemName}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatAmount(item.unitPrice)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatAmount(item.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
