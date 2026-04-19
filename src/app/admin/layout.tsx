import type { Metadata } from 'next'
import { AdminLayoutClient } from '@/components/admin/admin-layout-client'

export const metadata: Metadata = {
  title: {
    default: '관리자',
    template: '%s | 관리자',
  },
}

/**
 * 관리자 전용 레이아웃
 *
 * /admin/auth 페이지에서는 사이드바와 헤더를 숨김
 * 나머지 /admin/* 페이지에서는 좌측 사이드바(240px) + 우측 메인 콘텐츠 영역 구조
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
