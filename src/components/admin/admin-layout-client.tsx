'use client'

import { usePathname } from 'next/navigation'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'

/**
 * 관리자 레이아웃 (Client Component)
 * /admin/auth 페이지에서는 사이드바와 헤더를 숨김
 */
export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/admin/auth'

  // 로그인 페이지: 레이아웃 없이 children만 렌더링
  if (isAuthPage) {
    return <>{children}</>
  }

  // 일반 관리자 페이지: 사이드바 + 헤더 포함 레이아웃
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
