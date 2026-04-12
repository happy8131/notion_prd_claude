'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 관리자 사이드바 메뉴 항목 정의
 */
const navItems = [
  {
    href: '/admin',
    label: '대시보드',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/admin/invoices',
    label: '견적서 관리',
    icon: FileText,
    exact: false,
  },
]

interface AdminSidebarProps {
  /** 모바일 Sheet 내부에서 닫기 버튼을 표시할 때 사용 */
  onClose?: () => void
}

/**
 * 관리자 사이드바 내비게이션 컴포넌트
 * - 데스크탑: 고정 사이드바 (240px)
 * - 모바일: Sheet 드로어 내부에서 재사용
 */
export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-full flex-col">
      {/* 사이드바 헤더 */}
      <div className="border-border flex items-center justify-between border-b px-4 py-4">
        <div>
          <h2 className="text-lg font-bold">관리자</h2>
          <p className="text-muted-foreground text-xs">견적서 관리 시스템</p>
        </div>
        {/* 모바일 닫기 버튼 */}
        {onClose && (
          <button
            onClick={onClose}
            className="hover:bg-accent rounded-md p-1"
            aria-label="사이드바 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 내비게이션 메뉴 */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* 사이드바 푸터 */}
      <div className="border-border border-t p-4">
        <Link
          href="/invoices"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          ← 일반 화면으로
        </Link>
      </div>
    </div>
  )
}
