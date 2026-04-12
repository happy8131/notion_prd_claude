import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export const metadata: Metadata = {
  title: {
    default: '관리자',
    template: '%s | 관리자',
  },
}

/**
 * 관리자 전용 레이아웃
 *
 * 데스크탑 구조: 좌측 사이드바(240px) + 우측 메인 콘텐츠 영역
 * 모바일 구조: Sheet 드로어 기반 사이드바 (AdminHeader 내 햄버거 버튼)
 *
 * 기존 /invoices 경로 영향 없음 (별도 라우트 그룹)
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* 데스크탑 사이드바 (모바일에서 숨김) */}
      <aside className="border-border hidden w-60 shrink-0 overflow-y-auto border-r md:flex md:flex-col">
        <AdminSidebar />
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 상단 헤더 */}
        <AdminHeader />

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
