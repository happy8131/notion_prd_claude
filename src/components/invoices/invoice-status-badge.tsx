import { Badge } from '@/components/ui/badge'
import type { InvoiceStatus } from '@/types'

/**
 * 견적서 상태를 표시하는 배지 컴포넌트
 *
 * 상태별 색상:
 * - DRAFT (대기): 회색
 * - SENT (발송): 파랑
 * - ACCEPTED (수락): 초록
 * - EXPIRED (만료): 빨강
 */
const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: '대기',
    className: 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100',
  },
  SENT: {
    label: '발송',
    className: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
  },
  ACCEPTED: {
    label: '수락',
    className: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
  },
  EXPIRED: {
    label: '만료',
    className: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
  },
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = STATUS_CONFIG[status]

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
