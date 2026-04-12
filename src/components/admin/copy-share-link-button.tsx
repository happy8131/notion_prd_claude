'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getShareUrl } from '@/lib/share'

interface CopyShareLinkButtonProps {
  invoiceId: string
}

/**
 * 견적서 공유 링크를 클립보드에 복사하는 버튼
 *
 * 클립보드 복사 우선순위:
 * 1. navigator.clipboard.writeText() (모던 브라우저)
 * 2. input.select() + document.execCommand('copy') (레거시 폴백)
 */
export function CopyShareLinkButton({ invoiceId }: CopyShareLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = getShareUrl(invoiceId)

    try {
      // 1순위: 모던 Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        // 2순위: 레거시 폴백 (execCommand)
        const input = document.createElement('input')
        input.value = url
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }

      setCopied(true)
      toast('링크가 복사되었습니다', {
        description: '클라이언트에게 공유할 링크가 클립보드에 복사되었습니다.',
      })

      // 2초 후 아이콘 원복
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('링크 복사에 실패했습니다', {
        description: '브라우저 설정을 확인하거나 URL을 직접 복사해주세요.',
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-1.5"
      aria-label="공유 링크 복사"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Link2 className="h-3.5 w-3.5" />
      )}
      {copied ? '복사됨' : '링크 복사'}
    </Button>
  )
}
