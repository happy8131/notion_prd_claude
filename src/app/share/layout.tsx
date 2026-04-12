import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: '견적서 공유',
    template: '%s | 견적서 공유',
  },
}

/**
 * 공유 전용 레이아웃
 *
 * 인증 없이 공개 접근 가능한 공유 페이지 레이아웃
 * 심플 헤더만 포함 (관리자 사이드바 없음)
 *
 * TODO: 향후 인증 미들웨어 연동 시 /share/** 경로 예외 처리 필요
 */
export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background min-h-screen">
      {/* 공유 페이지 심플 헤더 */}
      <header className="border-border bg-background border-b">
        <div className="container mx-auto flex h-14 items-center px-4">
          <p className="text-muted-foreground text-sm font-medium">
            견적서 공유 문서
          </p>
        </div>
      </header>

      {/* 공유 페이지 콘텐츠 */}
      <main>{children}</main>
    </div>
  )
}
