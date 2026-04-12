'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { AdminSidebar } from './admin-sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface AdminHeaderProps {
  /** 현재 페이지 제목 */
  title?: string
}

/**
 * 관리자 상단 헤더 컴포넌트
 * - 모바일: 햄버거 메뉴 버튼 → Sheet 드로어로 사이드바 표시
 * - 데스크탑: md 이상에서 숨김 처리 (고정 사이드바 사용)
 */
export function AdminHeader({ title = '관리자' }: AdminHeaderProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <header className="border-border bg-background sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-4 md:px-6">
      {/* 모바일 햄버거 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSheetOpen(true)}
        aria-label="메뉴 열기"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* 모바일 Sheet 드로어 */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">관리자 메뉴</SheetTitle>
          <AdminSidebar onClose={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* 페이지 제목 */}
      <h1 className="flex-1 text-lg font-semibold">{title}</h1>

      {/* 테마 토글 */}
      <ThemeToggle />
    </header>
  )
}
