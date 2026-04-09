'use client'

import { Button } from '@/components/ui/button'
import type { Invoice } from '@/types'
import { useState } from 'react'

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
        console.error('PDF 템플릿 요소를 찾을 수 없습니다')
        throw new Error('PDF 템플릿 요소를 찾을 수 없습니다.')
      }

      console.log('[PDF] 템플릿 요소 발견:', element.id)

      // 동적 import (SSR 방지)
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      console.log('[PDF] html2canvas, jsPDF import 완료')

      // HTML을 Canvas로 캡처
      // onclone 콜백: iframe 내부에서 Tailwind 클래스 제거
      let canvas
      try {
        console.log('[PDF] html2canvas 옵션으로 캡처 시작')
        canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: true,
          allowTaint: true,
          removeContainer: false,
          imageTimeout: 0,
          // iframe 내부에서 Tailwind 클래스 제거
          onclone: clonedDocument => {
            console.log('[PDF] onclone 콜백: iframe 내 클래스 제거 시작')
            try {
              // iframe 내에서 원본 element 찾기
              const clonedElement = clonedDocument.getElementById(
                'invoice-pdf-template'
              )
              if (!clonedElement) {
                console.error(
                  '[PDF] iframe 내에서 invoice-pdf-template을 찾을 수 없음'
                )
                return
              }

              console.log('[PDF] iframe 내 요소 발견:', clonedElement.id)

              // 모든 요소의 class 제거 (root 포함)
              const allElements = [
                clonedElement,
                ...Array.from(clonedElement.querySelectorAll('*')),
              ]

              allElements.forEach(el => {
                if (el instanceof HTMLElement) {
                  el.removeAttribute('class')
                  console.log('[PDF] 클래스 제거 완료 -', el.tagName)
                }
              })

              console.log('[PDF] onclone 완료: 모든 클래스 제거됨')
            } catch (oncloneError) {
              console.error('[PDF] onclone 내부 오류:', oncloneError)
            }
          },
        })
        console.log('[PDF] 캔버스 생성 완료:', canvas.width, 'x', canvas.height)
      } catch (canvasError) {
        console.error('[PDF] html2canvas 오류 상세:', canvasError)
        console.error(
          '[PDF] 오류 타입:',
          canvasError instanceof Error ? canvasError.name : typeof canvasError
        )
        throw new Error(
          `html2canvas 오류: ${canvasError instanceof Error ? canvasError.message : String(canvasError)}`
        )
      }

      // Canvas를 PNG 이미지로 변환
      const imgData = canvas.toDataURL('image/png')
      console.log('[PDF] 이미지 데이터 변환 완료')

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

      console.log('[PDF] PDF 문서 생성 완료')

      // PDF 파일명: 견적서_INV-XXXX-XXX.pdf
      const filename = `견적서_${invoice.invoiceNumber}.pdf`
      pdf.save(filename)

      console.log('[PDF] PDF 저장 완료:', filename)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      console.error('[PDF] 다운로드 오류 (상세):', errorMessage)
      console.error('[PDF] 전체 에러 객체:', error)
      alert(`PDF 다운로드 실패: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      className="cursor-pointer gap-2"
    >
      {isLoading ? '생성 중...' : children}
    </Button>
  )
}
