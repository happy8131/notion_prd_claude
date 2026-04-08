'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface PdfDownloadButtonProps {
  children?: React.ReactNode
}

/**
 * PDF 다운로드 버튼 (클라이언트 컴포넌트)
 * html2pdf를 동적으로 import하여 PDF 생성 및 다운로드
 */
export function PdfDownloadButton({
  children = 'PDF 다운로드',
}: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsLoading(true)

      // 현재 미구현 (Phase 2에서 구현)
      // html2pdf 라이브러리를 사용하여 PDF 생성
      alert('PDF 다운로드 기능은 Phase 2에서 구현됩니다.')
    } catch (error) {
      console.error('PDF 다운로드 오류:', error)
      alert('PDF 다운로드에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isLoading} className="gap-2">
      {isLoading ? '생성 중...' : children}
    </Button>
  )
}
