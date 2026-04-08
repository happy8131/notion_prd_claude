'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface InvoicePaginationProps {
  total: number
  page: number
  limit: number
}

/**
 * 견적서 목록 페이지네이션 컴포넌트
 *
 * - 이전/다음 버튼
 * - 현재 페이지 정보 표시
 * - URL searchParams 업데이트
 */
export function InvoicePagination({
  total,
  page,
  limit,
}: InvoicePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    router.push(`?${params.toString()}`)
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        전체 {total}건 • 페이지 {page}/{totalPages}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={!hasPrevPage}
          onClick={() => handlePageChange(page - 1)}
          className="h-10"
        >
          이전
        </Button>

        <Button
          variant="outline"
          disabled={!hasNextPage}
          onClick={() => handlePageChange(page + 1)}
          className="h-10"
        >
          다음
        </Button>
      </div>
    </div>
  )
}
