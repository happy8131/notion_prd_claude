'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'

/**
 * 관리자 비밀번호 로그인 페이지
 */
export default function AdminAuthPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || '인증에 실패했습니다')
        setLoading(false)
        return
      }

      // 인증 성공
      setSuccess(true)

      // 짧은 지연 후 리다이렉트
      setTimeout(() => {
        router.push('/admin/invoices')
      }, 800)
    } catch (err) {
      console.error('인증 요청 오류:', err)
      setError('인증 처리 중 오류가 발생했습니다')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* 헤더 */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">관리자 로그인</h1>
          <p className="text-muted-foreground">
            관리자 페이지에 접근하려면 비밀번호를 입력하세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* 성공 메시지 */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">
              ✓ 인증 성공! 관리자 페이지로 이동합니다...
            </p>
          </div>
        )}

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading || success}
              className="h-10"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={loading || success}
            className="h-10 w-full"
          >
            {loading ? '인증 중...' : success ? '리다이렉트 중...' : '로그인'}
          </Button>
        </form>

        {/* 안내 메시지 */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="text-sm text-blue-800">
            <p className="font-medium">테스트 비밀번호</p>
            <p className="mt-2 font-mono">admin123</p>
            <p className="mt-2 text-xs opacity-80">
              .env.local의 ADMIN_PASSWORD에서 변경할 수 있습니다
            </p>
          </div>
        </div>

        {/* 돌아가기 링크 */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
