# Notion API 견적서 관리 시스템 개발 가이드

이 문서는 Notion API를 사용하여 견적서(Invoice) 관리 시스템을 구축하는 방법을 설명합니다.
Next.js 15.5.3 + TypeScript + Server Actions 환경에 최적화된 구현 패턴을 제공합니다.

---

## 목차

1. [환경 설정](#1-환경-설정)
2. [Notion Database 구조 설계](#2-notion-database-구조-설계)
3. [TypeScript 타입 정의](#3-typescript-타입-정의)
4. [Notion API 클라이언트 설정](#4-notion-api-클라이언트-설정)
5. [데이터 변환 유틸리티](#5-데이터-변환-유틸리티)
6. [핵심 API 함수 구현](#6-핵심-api-함수-구현)
7. [Server Actions 통합](#7-server-actions-통합)
8. [레이트 리밋 & 성능 최적화](#8-레이트-리밋--성능-최적화)
9. [에러 핸들링 패턴](#9-에러-핸들링-패턴)
10. [캐싱 전략](#10-캐싱-전략)

---

## 1. 환경 설정

### 패키지 설치

```bash
npm install @notionhq/client
```

### 환경변수 설정

`.env.local` 파일에 추가:

```bash
# Notion API 인증 토큰 (Notion Integration에서 발급)
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx

# 견적서 데이터베이스 ID (URL에서 추출: notion.so/workspace/DATABASE_ID?v=...)
NOTION_INVOICE_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 환경변수 검증 (`src/lib/env.ts` 확장)

```typescript
// Notion API 관련 환경변수 검증
export const notionEnv = {
  apiKey: process.env.NOTION_API_KEY ?? '',
  invoiceDatabaseId: process.env.NOTION_INVOICE_DATABASE_ID ?? '',
} as const

// 런타임에 환경변수 존재 여부 검증
export function validateNotionEnv() {
  if (!notionEnv.apiKey) {
    throw new Error('NOTION_API_KEY 환경변수가 설정되지 않았습니다.')
  }
  if (!notionEnv.invoiceDatabaseId) {
    throw new Error(
      'NOTION_INVOICE_DATABASE_ID 환경변수가 설정되지 않았습니다.'
    )
  }
}
```

---

## 2. Notion Database 구조 설계

### 견적서 데이터베이스 속성 설계

아래는 각 필드에 Notion 속성 타입을 매핑한 설계입니다.

| 필드        | Notion 속성 타입 | 이유                                                                        |
| ----------- | ---------------- | --------------------------------------------------------------------------- |
| 견적서 번호 | `title`          | 모든 DB에 필수. 제목 필드로 견적서 번호 사용. 검색 및 정렬 기본 키 역할     |
| 고객명      | `rich_text`      | 텍스트 검색 가능. 서식 지원 (볼드 등)                                       |
| 고객 이메일 | `email`          | email 타입은 유효성 검증 내장, 클릭 시 mailto 링크 자동 생성                |
| 상품 목록   | `rich_text`      | JSON 문자열로 직렬화. Notion은 배열 타입이 없어 JSON 저장이 현실적인 선택   |
| 총 금액     | `number`         | 숫자 연산, 롤업 가능. format: "won" 또는 "dollar" 지정 가능                 |
| 통화        | `select`         | 선택지 제한 (KRW/USD). 오타 방지, 필터링 용이                               |
| 작성일      | `date`           | 날짜 범위 필터, 정렬 지원. created_time 자동 추적 속성과 별개로 명시적 관리 |
| 유효기간    | `date`           | 날짜 비교 필터로 만료 여부 쿼리 가능                                        |
| 상태        | `select`         | Draft/Sent/Accepted/Expired 4개 값. status 타입보다 유연한 커스텀 선택 가능 |
| 비고        | `rich_text`      | 긴 텍스트 및 서식 지원                                                      |

> **상품 목록에 대한 주요 결정:**
> Notion API는 중첩 배열 타입을 지원하지 않습니다. 상품 목록(name, quantity, unitPrice, amount)은
> JSON 문자열로 직렬화하여 `rich_text` 필드에 저장하는 것이 가장 실용적입니다.
> 대안으로 별도의 "상품 항목" 데이터베이스를 만들고 `relation`으로 연결하는 방법도 있지만,
> 복잡도가 크게 증가하므로 소규모 시스템에서는 JSON 직렬화를 권장합니다.

### Notion에서 데이터베이스 생성 시 속성 설정

```json
{
  "properties": {
    "견적서 번호": { "title": {} },
    "고객명": { "rich_text": {} },
    "고객 이메일": { "email": {} },
    "상품 목록": { "rich_text": {} },
    "총 금액": {
      "number": { "format": "number" }
    },
    "통화": {
      "select": {
        "options": [
          { "name": "KRW", "color": "blue" },
          { "name": "USD", "color": "green" }
        ]
      }
    },
    "작성일": { "date": {} },
    "유효기간": { "date": {} },
    "상태": {
      "select": {
        "options": [
          { "name": "Draft", "color": "gray" },
          { "name": "Sent", "color": "yellow" },
          { "name": "Accepted", "color": "green" },
          { "name": "Expired", "color": "red" }
        ]
      }
    },
    "비고": { "rich_text": {} }
  }
}
```

---

## 3. TypeScript 타입 정의

`src/lib/types/invoice.ts` 파일을 생성합니다.

```typescript
// 견적서 상태 타입
export type InvoiceStatus = 'Draft' | 'Sent' | 'Accepted' | 'Expired'

// 지원 통화 타입
export type InvoiceCurrency = 'KRW' | 'USD'

// 상품 항목 타입 (rich_text에 JSON으로 저장됨)
export interface InvoiceItem {
  name: string // 상품명
  quantity: number // 수량
  unitPrice: number // 단가
  amount: number // 금액 (quantity * unitPrice)
}

// 견적서 도메인 타입 (애플리케이션 내부 사용)
export interface Invoice {
  id: string // Notion 페이지 ID
  invoiceNumber: string // 견적서 번호 (title 필드)
  customerName: string // 고객명
  customerEmail: string // 고객 이메일
  items: InvoiceItem[] // 상품 목록
  totalAmount: number // 총 금액
  currency: InvoiceCurrency // 통화
  issueDate: string // 작성일 (ISO 8601)
  dueDate: string // 유효기간 (ISO 8601)
  status: InvoiceStatus // 상태
  notes: string // 비고
  createdAt: string // Notion 페이지 생성 시간
  updatedAt: string // Notion 페이지 수정 시간
}

// 견적서 목록 조회 필터 옵션
export interface InvoiceFilter {
  status?: InvoiceStatus
  currency?: InvoiceCurrency
  customerName?: string
  dateFrom?: string // 작성일 시작
  dateTo?: string // 작성일 종료
}

// 페이지네이션 옵션
export interface PaginationOptions {
  pageSize?: number // 최대 100, 기본값 100
  startCursor?: string // 다음 페이지 커서
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  results: T[]
  hasMore: boolean
  nextCursor: string | null
}

// Server Action 공통 응답 타입
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

---

## 4. Notion API 클라이언트 설정

`src/lib/notion/client.ts` 파일을 생성합니다.

```typescript
import { Client } from '@notionhq/client'
import { validateNotionEnv, notionEnv } from '@/lib/env'

// 환경변수 검증 후 클라이언트 생성
validateNotionEnv()

// Notion 클라이언트 싱글톤 (서버 사이드 전용)
// Next.js 서버 환경에서 모듈 캐싱으로 인스턴스 재사용
export const notionClient = new Client({
  auth: notionEnv.apiKey,
})

// 데이터베이스 ID 상수
export const INVOICE_DATABASE_ID = notionEnv.invoiceDatabaseId
```

---

## 5. 데이터 변환 유틸리티

Notion API 응답은 복잡한 중첩 구조를 가집니다.
`src/lib/notion/transforms.ts` 파일로 변환 로직을 분리합니다.

```typescript
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  InvoiceCurrency,
} from '@/lib/types/invoice'

// Notion rich_text 배열에서 plain_text 추출
function extractRichText(
  property: PageObjectResponse['properties'][string]
): string {
  if (property.type !== 'rich_text') return ''
  return property.rich_text.map(t => t.plain_text).join('')
}

// Notion title 배열에서 plain_text 추출
function extractTitle(
  property: PageObjectResponse['properties'][string]
): string {
  if (property.type !== 'title') return ''
  return property.title.map(t => t.plain_text).join('')
}

// Notion email 속성에서 값 추출
function extractEmail(
  property: PageObjectResponse['properties'][string]
): string {
  if (property.type !== 'email') return ''
  return property.email ?? ''
}

// Notion number 속성에서 값 추출
function extractNumber(
  property: PageObjectResponse['properties'][string]
): number {
  if (property.type !== 'number') return 0
  return property.number ?? 0
}

// Notion select 속성에서 선택 값 추출
function extractSelect(
  property: PageObjectResponse['properties'][string]
): string {
  if (property.type !== 'select') return ''
  return property.select?.name ?? ''
}

// Notion date 속성에서 시작 날짜 추출
function extractDate(
  property: PageObjectResponse['properties'][string]
): string {
  if (property.type !== 'date') return ''
  return property.date?.start ?? ''
}

// rich_text 필드에 저장된 JSON을 InvoiceItem 배열로 파싱
function parseInvoiceItems(jsonString: string): InvoiceItem[] {
  if (!jsonString) return []
  try {
    const parsed = JSON.parse(jsonString)
    if (!Array.isArray(parsed)) return []
    return parsed as InvoiceItem[]
  } catch {
    // JSON 파싱 실패 시 빈 배열 반환 (데이터 손상 방어)
    console.error('상품 목록 JSON 파싱 실패:', jsonString)
    return []
  }
}

// Notion 페이지 응답 객체를 Invoice 도메인 타입으로 변환
export function transformPageToInvoice(page: PageObjectResponse): Invoice {
  const props = page.properties

  return {
    id: page.id,
    invoiceNumber: extractTitle(props['견적서 번호']),
    customerName: extractRichText(props['고객명']),
    customerEmail: extractEmail(props['고객 이메일']),
    items: parseInvoiceItems(extractRichText(props['상품 목록'])),
    totalAmount: extractNumber(props['총 금액']),
    currency: extractSelect(props['통화']) as InvoiceCurrency,
    issueDate: extractDate(props['작성일']),
    dueDate: extractDate(props['유효기간']),
    status: extractSelect(props['상태']) as InvoiceStatus,
    notes: extractRichText(props['비고']),
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
  }
}

// InvoiceItem 배열을 JSON 문자열로 직렬화 (Notion 저장용)
export function serializeInvoiceItems(items: InvoiceItem[]): string {
  return JSON.stringify(items)
}
```

---

## 6. 핵심 API 함수 구현

`src/lib/notion/invoice-api.ts` 파일을 생성합니다.

```typescript
import { notionClient, INVOICE_DATABASE_ID } from '@/lib/notion/client'
import {
  transformPageToInvoice,
  serializeInvoiceItems,
} from '@/lib/notion/transforms'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type {
  Invoice,
  InvoiceFilter,
  InvoiceStatus,
  PaginationOptions,
  PaginatedResponse,
} from '@/lib/types/invoice'

// ─────────────────────────────────────────────
// getInvoices - 견적서 목록 조회
// ─────────────────────────────────────────────

export async function getInvoices(
  filter?: InvoiceFilter,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<Invoice>> {
  // Notion API 필터 조건 구성
  const filterConditions: object[] = []

  if (filter?.status) {
    filterConditions.push({
      property: '상태',
      select: { equals: filter.status },
    })
  }

  if (filter?.currency) {
    filterConditions.push({
      property: '통화',
      select: { equals: filter.currency },
    })
  }

  if (filter?.customerName) {
    filterConditions.push({
      property: '고객명',
      rich_text: { contains: filter.customerName },
    })
  }

  if (filter?.dateFrom) {
    filterConditions.push({
      property: '작성일',
      date: { on_or_after: filter.dateFrom },
    })
  }

  if (filter?.dateTo) {
    filterConditions.push({
      property: '작성일',
      date: { on_or_before: filter.dateTo },
    })
  }

  // 데이터베이스 쿼리 실행
  const response = await notionClient.databases.query({
    database_id: INVOICE_DATABASE_ID,
    // 필터 조건이 2개 이상이면 and 조합, 1개면 단일 필터, 없으면 생략
    ...(filterConditions.length > 1
      ? { filter: { and: filterConditions } }
      : filterConditions.length === 1
        ? { filter: filterConditions[0] }
        : {}),
    sorts: [
      {
        property: '작성일',
        direction: 'descending', // 최신 견적서 우선
      },
    ],
    page_size: pagination?.pageSize ?? 20,
    ...(pagination?.startCursor
      ? { start_cursor: pagination.startCursor }
      : {}),
  })

  // PageObjectResponse 타입만 필터링 (PartialPageObjectResponse 제외)
  const pages = response.results.filter(
    (page): page is PageObjectResponse => page.object === 'page'
  )

  return {
    results: pages.map(transformPageToInvoice),
    hasMore: response.has_more,
    nextCursor: response.next_cursor,
  }
}

// ─────────────────────────────────────────────
// getInvoiceById - 견적서 상세 조회
// ─────────────────────────────────────────────

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const page = await notionClient.pages.retrieve({ page_id: id })

    // PartialPageObjectResponse는 properties가 없으므로 타입 가드 필요
    if (!('properties' in page)) {
      return null
    }

    return transformPageToInvoice(page as PageObjectResponse)
  } catch (error) {
    // Notion API가 404를 반환하면 null 처리
    if (isNotionNotFoundError(error)) {
      return null
    }
    throw error
  }
}

// ─────────────────────────────────────────────
// updateInvoiceStatus - 견적서 상태 업데이트
// ─────────────────────────────────────────────

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus
): Promise<Invoice> {
  const response = await notionClient.pages.update({
    page_id: id,
    properties: {
      상태: {
        select: {
          name: status,
        },
      },
    },
  })

  return transformPageToInvoice(response as PageObjectResponse)
}

// ─────────────────────────────────────────────
// createInvoice - 견적서 생성
// ─────────────────────────────────────────────

export async function createInvoice(
  data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Invoice> {
  const response = await notionClient.pages.create({
    parent: {
      database_id: INVOICE_DATABASE_ID,
    },
    properties: {
      견적서번호: {
        title: [
          {
            type: 'text',
            text: { content: data.invoiceNumber },
          },
        ],
      },
      고객명: {
        rich_text: [
          {
            type: 'text',
            text: { content: data.customerName },
          },
        ],
      },
      '고객 이메일': {
        email: data.customerEmail,
      },
      '상품 목록': {
        rich_text: [
          {
            type: 'text',
            text: { content: serializeInvoiceItems(data.items) },
          },
        ],
      },
      '총 금액': {
        number: data.totalAmount,
      },
      통화: {
        select: { name: data.currency },
      },
      작성일: {
        date: { start: data.issueDate },
      },
      유효기간: {
        date: { start: data.dueDate },
      },
      상태: {
        select: { name: data.status },
      },
      비고: {
        rich_text: [
          {
            type: 'text',
            text: { content: data.notes },
          },
        ],
      },
    },
  })

  return transformPageToInvoice(response as PageObjectResponse)
}

// ─────────────────────────────────────────────
// 헬퍼: Notion 404 에러 판별
// ─────────────────────────────────────────────

function isNotionNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'object_not_found'
  )
}
```

---

## 7. Server Actions 통합

`src/lib/actions/invoice-actions.ts` 파일을 생성합니다.

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import {
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  createInvoice,
} from '@/lib/notion/invoice-api'
import type {
  Invoice,
  InvoiceFilter,
  InvoiceStatus,
  PaginationOptions,
  PaginatedResponse,
  ActionResult,
} from '@/lib/types/invoice'

// ─────────────────────────────────────────────
// 견적서 목록 조회 Action
// ─────────────────────────────────────────────

export async function fetchInvoicesAction(
  filter?: InvoiceFilter,
  pagination?: PaginationOptions
): Promise<ActionResult<PaginatedResponse<Invoice>>> {
  try {
    const data = await getInvoices(filter, pagination)
    return { success: true, data }
  } catch (error) {
    console.error('견적서 목록 조회 실패:', error)
    return {
      success: false,
      error: '견적서 목록을 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// ─────────────────────────────────────────────
// 견적서 상세 조회 Action
// ─────────────────────────────────────────────

export async function fetchInvoiceByIdAction(
  id: string
): Promise<ActionResult<Invoice | null>> {
  try {
    const data = await getInvoiceById(id)
    return { success: true, data }
  } catch (error) {
    console.error(`견적서 조회 실패 (ID: ${id}):`, error)
    return {
      success: false,
      error: '견적서를 불러오는 중 오류가 발생했습니다.',
    }
  }
}

// ─────────────────────────────────────────────
// 견적서 상태 업데이트 Action
// ─────────────────────────────────────────────

export async function updateInvoiceStatusAction(
  id: string,
  status: InvoiceStatus
): Promise<ActionResult<Invoice>> {
  try {
    const data = await updateInvoiceStatus(id, status)

    // 견적서 목록과 상세 페이지 캐시 무효화
    revalidatePath('/invoices')
    revalidatePath(`/invoices/${id}`)

    return { success: true, data }
  } catch (error) {
    console.error(`견적서 상태 업데이트 실패 (ID: ${id}):`, error)
    return {
      success: false,
      error: '견적서 상태 업데이트 중 오류가 발생했습니다.',
    }
  }
}

// ─────────────────────────────────────────────
// 견적서 생성 Action
// ─────────────────────────────────────────────

export async function createInvoiceAction(
  data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<Invoice>> {
  try {
    const invoice = await createInvoice(data)

    // 견적서 목록 캐시 무효화
    revalidatePath('/invoices')

    return { success: true, data: invoice }
  } catch (error) {
    console.error('견적서 생성 실패:', error)
    return {
      success: false,
      error: '견적서 생성 중 오류가 발생했습니다.',
    }
  }
}
```

### Server Component에서 직접 호출 패턴

```typescript
// src/app/invoices/page.tsx
// Server Component에서는 Action을 거치지 않고 API 함수를 직접 호출 가능

import { getInvoices } from '@/lib/notion/invoice-api'
import { InvoiceList } from '@/components/invoice/invoice-list'

export default async function InvoicesPage() {
  // Server Component에서 직접 Notion API 호출 (캐싱 자동 적용)
  const { results: invoices } = await getInvoices({ status: 'Sent' })

  return <InvoiceList invoices={invoices} />
}
```

---

## 8. 레이트 리밋 & 성능 최적화

### Notion API 제한 사항

- **레이트 리밋**: 초당 3개 요청 (Average). 초과 시 HTTP 429 반환
- **페이지 크기**: 최대 100개 (page_size)
- **응답 크기**: 페이지당 최대 100개 속성

### 재시도 로직 구현

`src/lib/notion/retry.ts` 파일을 생성합니다.

```typescript
// 지수 백오프(Exponential Backoff) 재시도 유틸리티
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number // 최대 재시도 횟수 (기본: 3)
    baseDelay?: number // 초기 대기 시간 ms (기본: 1000)
    maxDelay?: number // 최대 대기 시간 ms (기본: 10000)
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options

  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // 레이트 리밋(429) 또는 일시적 서버 오류(502, 503)만 재시도
      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error
      }

      // 지수 백오프: 1초 → 2초 → 4초 → ... (최대 10초)
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
      console.warn(
        `Notion API 요청 재시도 (${attempt + 1}/${maxRetries}), ${delay}ms 대기...`
      )
      await sleep(delay)
    }
  }

  throw lastError
}

// 재시도 가능한 에러 판별
function isRetryableError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false

  const notionError = error as { status?: number; code?: string }

  // 레이트 리밋
  if (notionError.status === 429) return true
  // 일시적 서버 오류
  if (notionError.status === 502 || notionError.status === 503) return true
  // 내부 서버 오류
  if (notionError.code === 'internal_server_error') return true

  return false
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### 재시도 로직 적용 예시

```typescript
// invoice-api.ts에서 재시도 로직 적용
import { withRetry } from '@/lib/notion/retry'

export async function getInvoices(
  filter?: InvoiceFilter,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<Invoice>> {
  // withRetry로 감싸서 레이트 리밋 자동 처리
  const response = await withRetry(() =>
    notionClient.databases.query({
      database_id: INVOICE_DATABASE_ID,
      // ... 쿼리 옵션
    })
  )

  // ... 응답 처리
}
```

### 전체 목록 가져오기 (페이지네이션 자동 처리)

```typescript
// 모든 페이지를 순회하여 전체 결과 수집
export async function getAllInvoices(
  filter?: InvoiceFilter
): Promise<Invoice[]> {
  const allInvoices: Invoice[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await getInvoices(filter, {
      pageSize: 100, // 최대값으로 요청 횟수 최소화
      startCursor: cursor ?? undefined,
    })

    allInvoices.push(...response.results)
    cursor = response.nextCursor ?? undefined
  } while (cursor)
  // has_more가 false이거나 nextCursor가 null이면 순회 종료

  return allInvoices
}
```

---

## 9. 에러 핸들링 패턴

### Notion API 에러 코드 참조

| HTTP 상태 | Notion 에러 코드        | 원인 및 대처                                        |
| --------- | ----------------------- | --------------------------------------------------- |
| 400       | `validation_error`      | 잘못된 요청 본문. 속성 타입 불일치 확인             |
| 401       | `unauthorized`          | API 키 오류. 환경변수 확인                          |
| 403       | `restricted_resource`   | 통합(Integration) 접근 권한 없음. DB 공유 설정 확인 |
| 404       | `object_not_found`      | 페이지/DB 없음 또는 접근 권한 없음                  |
| 409       | `conflict_error`        | 동시 수정 충돌                                      |
| 429       | `rate_limited`          | 레이트 리밋 초과. 재시도 필요                       |
| 500       | `internal_server_error` | Notion 서버 오류. 재시도 가능                       |

### 중앙화된 에러 핸들러

```typescript
// src/lib/notion/error-handler.ts

export class NotionAPIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'NotionAPIError'
  }
}

// Notion API 에러를 사용자 친화적 메시지로 변환
export function handleNotionError(error: unknown): never {
  if (typeof error === 'object' && error !== null) {
    const notionError = error as {
      code?: string
      status?: number
      message?: string
    }

    switch (notionError.code) {
      case 'object_not_found':
        throw new NotionAPIError(
          '요청한 데이터를 찾을 수 없습니다.',
          notionError.code,
          404
        )
      case 'unauthorized':
        throw new NotionAPIError(
          'Notion API 인증에 실패했습니다. API 키를 확인하세요.',
          notionError.code,
          401
        )
      case 'restricted_resource':
        throw new NotionAPIError(
          '데이터베이스 접근 권한이 없습니다. Integration 공유 설정을 확인하세요.',
          notionError.code,
          403
        )
      case 'validation_error':
        throw new NotionAPIError(
          `데이터 형식 오류: ${notionError.message ?? '속성 타입을 확인하세요.'}`,
          notionError.code,
          400
        )
      case 'rate_limited':
        throw new NotionAPIError(
          'API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.',
          notionError.code,
          429
        )
    }
  }

  // 알 수 없는 에러는 그대로 전파
  throw error
}
```

---

## 10. 캐싱 전략

### Next.js 15 fetch 캐싱 (Server Components)

Next.js 15에서는 fetch 기본값이 `no-store`로 변경되었습니다.
`@notionhq/client`는 내부적으로 fetch를 사용하므로, Server Component에서
데이터를 가져올 때 캐싱 설정을 명시해야 합니다.

```typescript
// src/app/invoices/page.tsx

// 방법 1: revalidate로 ISR(Incremental Static Regeneration) 설정
export const revalidate = 60 // 60초마다 캐시 갱신

export default async function InvoicesPage() {
  const { results } = await getInvoices()
  return <InvoiceList invoices={results} />
}
```

```typescript
// 방법 2: 특정 경로 revalidate (Server Action 후 캐시 무효화)
// src/lib/actions/invoice-actions.ts

import { revalidatePath, revalidateTag } from 'next/cache'

export async function updateInvoiceStatusAction(
  id: string,
  status: InvoiceStatus
) {
  await updateInvoiceStatus(id, status)

  // 특정 경로의 캐시 무효화
  revalidatePath('/invoices')
  revalidatePath(`/invoices/${id}`)
}
```

### 캐싱 전략 가이드라인

| 데이터 유형             | 권장 전략   | 설정 방법                        |
| ----------------------- | ----------- | -------------------------------- |
| 견적서 목록 (잦은 변경) | 60초 ISR    | `export const revalidate = 60`   |
| 견적서 상세 (가끔 변경) | 300초 ISR   | `export const revalidate = 300`  |
| 상태 업데이트 후        | 즉시 무효화 | `revalidatePath('/invoices')`    |
| 정적 통계 데이터        | 1시간 ISR   | `export const revalidate = 3600` |

---

## 권장 파일 구조

```
src/
├── lib/
│   ├── env.ts                          # 환경변수 검증
│   ├── types/
│   │   └── invoice.ts                  # Invoice 도메인 타입
│   ├── notion/
│   │   ├── client.ts                   # Notion 클라이언트 싱글톤
│   │   ├── transforms.ts               # API 응답 → 도메인 타입 변환
│   │   ├── invoice-api.ts              # 핵심 CRUD 함수
│   │   ├── retry.ts                    # 재시도 유틸리티
│   │   └── error-handler.ts            # 에러 핸들링
│   └── actions/
│       └── invoice-actions.ts          # Server Actions
├── components/
│   └── invoice/
│       ├── invoice-list.tsx            # 목록 컴포넌트
│       ├── invoice-card.tsx            # 카드 컴포넌트
│       ├── invoice-detail.tsx          # 상세 컴포넌트
│       └── invoice-status-badge.tsx    # 상태 배지 컴포넌트
└── app/
    └── invoices/
        ├── page.tsx                    # 목록 페이지 (Server Component)
        └── [id]/
            └── page.tsx                # 상세 페이지 (Server Component)
```

---

## 주요 주의사항

1. **통합(Integration) 공유 필수**: Notion 데이터베이스 우측 상단 "..." 메뉴에서
   생성한 Integration을 반드시 공유해야 합니다. 공유하지 않으면 403 에러 발생.

2. **속성명 일치**: API에서 사용하는 속성명은 Notion DB의 열 이름과 정확히 일치해야 합니다.
   한글 속성명 사용 가능하지만 오타에 주의하세요.

3. **상품 목록 JSON 크기 제한**: `rich_text` 속성은 최대 2,000자 제한.
   상품 항목이 많을 경우 별도 데이터베이스 + relation 구조 고려.

4. **타입 가드 필수**: Notion API 응답은 `PageObjectResponse | PartialPageObjectResponse`
   유니온 타입. `'properties' in page` 체크 후 사용해야 합니다.

5. **레이트 리밋**: 초당 3회 제한. 배치 작업 시 `withRetry` + 인위적 지연 추가 권장.
