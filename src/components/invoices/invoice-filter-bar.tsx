'use client'

import { useRouter } from 'next/navigation'
import { useDebounceValue } from 'usehooks-ts'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useCallback, useEffect, useState } from 'react'
import type { InvoiceFilterValues } from '@/lib/validations/invoice'

interface InvoiceFilterBarProps {
  defaultValues?: InvoiceFilterValues
  /** 필터 초기화 시 이동할 기본 경로 (기본값: '/invoices') */
  basePath?: string
}

/**
 * 견적서 목록 검색/필터 컴포넌트
 *
 * - 검색어 입력 (300ms debounce)
 * - 상태 필터
 * - 날짜 범위 필터 (Phase 2에서 확장)
 * - URL searchParams 자동 업데이트
 */
export function InvoiceFilterBar({
  defaultValues,
  basePath = '/invoices',
}: InvoiceFilterBarProps) {
  const router = useRouter()

  // 검색어 상태 관리
  const [search, setSearch] = useState(defaultValues?.search ?? '')
  const debouncedSearch = useDebounceValue(search, 300)[0]

  // 상태 필터 상태 관리
  const [status, setStatus] = useState(defaultValues?.status ?? '')

  // 날짜 범위 필터 상태 관리
  const [dateFrom, setDateFrom] = useState(defaultValues?.dateFrom ?? '')
  const [dateTo, setDateTo] = useState(defaultValues?.dateTo ?? '')

  // 통화 필터 상태 관리
  const [currency, setCurrency] = useState(defaultValues?.currency ?? '')

  // URL에 반영
  useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedSearch) params.set('search', debouncedSearch)
    if (status) params.set('status', status)
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo) params.set('dateTo', dateTo)
    if (currency) params.set('currency', currency)

    // page 파라미터는 필터 변경 시 1로 리셋
    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }, [debouncedSearch, status, dateFrom, dateTo, currency, router])

  const handleClearFilters = useCallback(() => {
    setSearch('')
    setStatus('')
    setDateFrom('')
    setDateTo('')
    setCurrency('')
    router.push(basePath)
  }, [router, basePath])

  return (
    <div className="border-border bg-card mb-6 space-y-4 rounded-lg border p-4">
      <div className="grid gap-4 md:grid-cols-3">
        {/* 검색 입력 */}
        <div className="flex-1">
          <label className="text-foreground mb-2 block text-sm font-medium">
            검색 (견적서 번호 또는 고객명)
          </label>
          <Input
            placeholder="검색어를 입력하세요"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-10"
          />
        </div>

        {/* 상태 필터 */}
        <div className="flex-1">
          <label className="text-foreground mb-2 block text-sm font-medium">
            상태
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">대기</SelectItem>
              <SelectItem value="SENT">발송</SelectItem>
              <SelectItem value="ACCEPTED">수락</SelectItem>
              <SelectItem value="EXPIRED">만료</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 통화 필터 */}
        <div className="flex-1">
          <label className="text-foreground mb-2 block text-sm font-medium">
            통화
          </label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KRW">KRW (원)</SelectItem>
              <SelectItem value="USD">USD (달러)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* 시작일 필터 */}
        <div className="flex-1">
          <label className="text-foreground mb-2 block text-sm font-medium">
            발행일 (시작)
          </label>
          <Input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="h-10"
          />
        </div>

        {/* 종료일 필터 */}
        <div className="flex-1">
          <label className="text-foreground mb-2 block text-sm font-medium">
            발행일 (종료)
          </label>
          <Input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="h-10"
          />
        </div>

        {/* 초기화 버튼 */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="h-10 w-full"
          >
            초기화
          </Button>
        </div>
      </div>

      {/* 활성 필터 표시 */}
      {(search || status || dateFrom || dateTo || currency) && (
        <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
          {search && <span>검색: {search}</span>}
          {status && (
            <span>
              상태:{' '}
              {status === 'DRAFT'
                ? '대기'
                : status === 'SENT'
                  ? '발송'
                  : status === 'ACCEPTED'
                    ? '수락'
                    : '만료'}
            </span>
          )}
          {currency && <span>통화: {currency}</span>}
          {dateFrom && <span>시작일: {dateFrom}</span>}
          {dateTo && <span>종료일: {dateTo}</span>}
        </div>
      )}
    </div>
  )
}
