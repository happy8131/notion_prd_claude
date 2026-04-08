'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * 견적서 목록 페이지 에러 바운더리
 * Notion API 오류 등 런타임 오류를 사용자 친화적으로 표시
 */
export default function InvoicesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[InvoicesError]', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-lg border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">데이터 로드 오류</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            견적서 목록을 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="rounded bg-gray-50 px-3 py-2 font-mono text-sm text-gray-500">
            {error.message || 'Notion 데이터 조회 실패'}
          </p>
          <Button onClick={reset} className="w-full">
            다시 시도
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
