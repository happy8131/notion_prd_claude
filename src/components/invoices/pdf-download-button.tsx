'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { Invoice } from '@/types'

interface PdfDownloadButtonProps {
  invoice: Invoice
  children?: React.ReactNode
}

/**
 * PDF 다운로드 버튼 (클라이언트 컴포넌트)
 * html2canvas로 invoice-pdf-template을 이미지로 캡처하고,
 * jsPDF로 PDF 파일을 생성하여 다운로드
 */
export function PdfDownloadButton({
  invoice,
  children = 'PDF 다운로드',
}: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsLoading(true)

      // DOM 요소 가져오기
      const element = document.getElementById('invoice-pdf-template')
      if (!element) {
        throw new Error('PDF 템플릿 요소를 찾을 수 없습니다.')
      }

      // 동적 import (SSR 방지)
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      // HTML을 Canvas로 캡처
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
      })

      // Canvas를 PNG 이미지로 변환
      const imgData = canvas.toDataURL('image/png')

      // PDF 문서 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      // 이미지를 PDF에 추가 (A4 너비에 맞춤)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

      // PDF 파일명: 견적서_INV-XXXX-XXX.pdf
      const filename = `견적서_${invoice.invoiceNumber}.pdf`
      pdf.save(filename)
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
