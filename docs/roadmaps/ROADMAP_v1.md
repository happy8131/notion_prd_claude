# 노션 기반 견적서 웹 애플리케이션 개발 로드맵

## 개요

### 프로젝트 비전

Notion 데이터베이스를 단일 데이터 소스(Single Source of Truth)로 활용하여, 영업팀이 작성한 견적서를 클라이언트가 웹에서 조회하고 PDF로 다운로드할 수 있는 경량 견적서 포털을 구축합니다.

### 주요 목표

- Notion API 연동을 통한 실시간 견적서 데이터 제공
- 클라이언트가 견적서를 즉시 PDF로 다운로드할 수 있는 사용자 경험 제공
- Next.js 15 App Router 기반의 모던 웹 아키텍처 구현

### 기술 스택 요약

| 분류         | 기술                                    |
| ------------ | --------------------------------------- |
| Framework    | Next.js 15.5.3 (App Router + Turbopack) |
| Runtime      | React 19.1.0 + TypeScript 5.6+          |
| Styling      | TailwindCSS v4 + shadcn/ui (new-york)   |
| External API | Notion API (@notionhq/client)           |
| PDF          | html2pdf                                |
| Forms        | React Hook Form 7.x + Zod               |

### 예상 완료 기간

**총 4주** (2026년 4월 2일 기준)

| 페이즈                              | 기간 | 완료 목표일 |
| ----------------------------------- | ---- | ----------- |
| Phase 0: 환경 구성                  | 1일  | 2026-04-03  |
| Phase 1: Notion 연동 및 견적서 목록 | 7일  | 2026-04-10  |
| Phase 2: 견적서 상세 및 PDF         | 5일  | 2026-04-17  |
| Phase 3: UI 개선 및 배포            | 3일  | 2026-04-20  |

### E2E 테스트 필수 원칙

> **테스트 없이 작업 완료 불가** - API 연동 또는 비즈니스 로직을 구현한 모든 Phase는 반드시 Playwright MCP로 E2E 테스트를 수행해야 PR 머지 자격이 부여됩니다.

- **도구**: Playwright MCP (`mcp__playwright__*` 도구 사용)
- **적용 범위**: Phase 1 (Notion 연동) ~ Phase 2 (PDF) 전 기능
- **테스트 실패 시**: 해당 Phase 작업은 미완료 상태로 간주

---

## 현재 구현 상태 (2026-04-10 기준)

> Phase 3 진행 중입니다. Phase 1, 2는 완료되었고, Phase 3-4 (빌드 검증)가 완료되었습니다.
>
> **현재**: Phase 3-1~3, 3-5 E2E 테스트 및 배포 진행 중
> **다음 단계**: Vercel 배포 설정 및 프로덕션 스모크 테스트

### 완료된 작업

**인프라 & 초기 설정**

- [x] Next.js 15.5.3 + React 19 + TypeScript 프로젝트 초기화
- [x] TailwindCSS v4 + shadcn/ui (new-york) 설정
- [x] ESLint + Prettier + Husky + lint-staged 개발 도구 설정
- [x] Notion API 클라이언트 설정 (`src/lib/notion/client.ts`)
- [x] Supabase 클라이언트 설정 (환경 변수만 추가 필요)
- [x] 공통 TypeScript 타입 정의 (`src/types/index.ts`) - Invoice, InvoiceItem, API 응답 타입

**Phase 1 관련 구현**

- [x] 페이지 라우팅 구조 - `/invoices`, `/invoices/[id]`
- [x] 페이지 셸(Shell) 생성 - 각 페이지 레이아웃 및 TODO 주석 포함
- [x] 견적서 목록 Route Handler (`/api/invoices`) - Zod 검증, 캐싱, 에러 처리 포함
- [x] 데이터 변환 레이어 (`transformers.ts`) - Notion API 응답 → Invoice 타입 변환
- [x] 견적서 목록 테이블 컴포넌트 (6개 컬럼, 통화 포맷, 상태 배지, 만료 표시)
- [x] 검색 입력 컴포넌트 (300ms debounce, URL searchParams 자동 업데이트)
- [x] 필터링 컴포넌트 - 상태 필터 구현 완료 (날짜 범위, 통화 UI 미구현)
- [x] 페이지네이션 컴포넌트 (이전/다음 버튼, 페이지 정보 표시)
- [x] 로딩 상태 Skeleton UI (5행 프리로더)
- [x] 빈 상태 UI (검색 결과 없을 때)
- [x] 견적서 목록 페이지 조립 (서버 컴포넌트, Suspense, 초기 데이터 로드)

**인증 & 부가 기능 (범위 외)**

- [x] 로그인 폼 UI + Zod 검증 (`components/auth/login-form.tsx`)
- [x] 회원가입 폼 UI + Zod 검증 (`components/auth/signup-form.tsx`)
- [ ] Supabase 인증 연동 (UI는 완료, 로직 TODO)
- [ ] 미들웨어 인증 리다이렉트 (현재 pass-through, 리다이렉트 로직 필요)

### 진행 상황

**2026-04-09 기준:**

- Phase 0: 완료 ✅
- Phase 1: 완료 ✅ (7/7 완료)
  - ✅ Notion API 연동 (실제 데이터 조회)
  - ✅ 검색, 필터링, 페이지네이션
  - ✅ 에러 바운더리 구현
- Phase 2: 완료 ✅ (5/5 완료)
  - ✅ 3-1: 상품(Items) DB 조회 및 연동
  - ✅ 3-2~3-5: PDF 다운로드 기능 (완료: 2026-04-09)
- Phase 3: 진행 중 🚀 (1/5 완료)
  - ⏳ 3-1: E2E 테스트 - 전체 여정 (진행 예정)
  - ⏳ 3-2: 에러 시나리오 테스트 (진행 예정)
  - ⏳ 3-3: 반응형 UI 검증 (진행 예정)
  - ✅ 3-4: 배포 설정 및 빌드 검증 (완료: 2026-04-10)
  - ⏳ 3-5: 프로덕션 배포 및 스모크 테스트 (진행 예정)

---

## 페이즈별 계획

---

### Phase 0: 환경 구성 및 외부 서비스 연결

- **목표**: 개발 환경을 완성하고 Notion 외부 서비스와 실제 연결을 검증합니다.
- **예상 기간**: 1일
- **우선순위**: Must Have (이후 모든 페이즈의 전제 조건)
- **관련 기능**: 없음 (인프라)

#### 작업 목록

| 작업 | 설명                                                       | 소요 시간 |
| ---- | ---------------------------------------------------------- | --------- |
| 0-1  | `.env.local` 환경 변수 설정 (Notion API Key/DB ID)         | 0.5일     |
| 0-2  | Notion 견적서 데이터베이스 스키마 확인 및 샘플 데이터 입력 | 0.5일     |

#### 환경 변수 목록

```bash
NOTION_API_KEY=
NOTION_INVOICE_DATABASE_ID=
```

#### 완료 기준

- [ ] `npm run dev` 실행 시 에러 없이 앱이 시작됨
- [ ] Notion API 호출 테스트 스크립트가 정상 응답을 반환함
- [ ] 미들웨어가 비인증 접근을 `/login`으로 올바르게 리다이렉트함

#### PR 단위

- `feat/env-setup`: 환경 변수 설정 및 외부 서비스 연결 검증

> Phase 0은 인프라 구성 단계로 E2E 테스트보다 수동 연결 검증으로 완료 기준을 충족합니다.

---

### Phase 1: Notion 연동 및 견적서 목록 구현 (F001, F002, F003) ✅

- **목표**: Notion API를 통해 견적서 데이터를 가져오고, 검색/필터링이 가능한 목록 페이지를 완성합니다.
- **예상 기간**: 7일
- **우선순위**: Must Have (핵심 데이터 레이어)
- **관련 기능**: F001 (Notion 데이터 연동), F002 (견적서 목록 조회), F003 (검색 및 필터링)
- **📅 최종 업데이트**: 2026-04-08
- **선행 요구사항**: Phase 0 완료, Notion 데이터베이스에 샘플 데이터 존재

#### 작업 목록

| 작업 | 설명                                                                      | 소요 시간 |
| ---- | ------------------------------------------------------------------------- | --------- |
| 2-1  | Notion API 서비스 레이어 구현 - 데이터베이스 쿼리 및 데이터 변환          | 1.5일     |
| 2-2  | 견적서 목록 조회 Route Handler 구현 (`/api/invoices`)                     | 1일       |
| 2-3  | 견적서 목록 테이블 컴포넌트 구현 (shadcn/ui Table)                        | 1일       |
| 2-4  | 검색 입력 컴포넌트 구현 - 견적서 번호/고객명 실시간 검색                  | 0.5일     |
| 2-5  | 필터링 컴포넌트 구현 - 상태(Draft/Sent/Accepted/Expired), 날짜 범위, 통화 | 1일       |
| 2-6  | 페이지네이션 컴포넌트 구현                                                | 0.5일     |
| 2-7  | 견적서 목록 페이지 조립 - 서버 컴포넌트로 초기 데이터 로드                | 0.5일     |
| 2-8  | 로딩/에러/빈 상태 UI 처리 (Skeleton, Error Boundary)                      | 1일       |

#### 구현 세부 사항

**Notion 서비스 레이어 파일 경로**

```
src/
  lib/
    notion/
      client.ts          # 기존 - Notion 클라이언트 인스턴스
      invoice-service.ts # 신규 - 견적서 조회 비즈니스 로직
      transformers.ts    # 신규 - Notion 응답 → Invoice 타입 변환
  app/
    api/
      invoices/
        route.ts         # GET /api/invoices - 목록 조회
```

**Notion 데이터 변환 매핑**

| Notion 프로퍼티       | Invoice 필드    |
| --------------------- | --------------- |
| `견적서 번호` (title) | `invoiceNumber` |
| `고객명` (text)       | `customerName`  |
| `고객 이메일` (email) | `customerEmail` |
| `총 금액` (number)    | `totalAmount`   |
| `통화` (select)       | `currency`      |
| `상태` (select)       | `status`        |
| `작성일` (date)       | `createdDate`   |
| `유효기간` (date)     | `expiryDate`    |
| `비고` (text)         | `notes`         |

**검색/필터 파라미터**

```typescript
// GET /api/invoices?search=INV-2024&status=SENT&currency=KRW&dateFrom=2024-01-01&page=1&limit=20
```

**견적서 목록 테이블 컬럼**

| 컬럼        | 설명                             |
| ----------- | -------------------------------- |
| 견적서 번호 | 클릭 시 상세 페이지 이동         |
| 고객명      | -                                |
| 금액        | 통화 단위 포함 (KRW: 원, USD: $) |
| 상태        | Badge 컴포넌트로 색상 구분       |
| 작성일      | `YYYY-MM-DD` 형식                |
| 유효기간    | 만료 시 취소선 또는 회색 처리    |

#### 완료 기준

- [x] `/invoices` 페이지에서 Notion 데이터베이스의 견적서 목록이 표시됨 (실제 Notion API 호출 구현)
- [x] 견적서 번호 또는 고객명으로 검색 가능
- [x] 상태, 날짜 범위, 통화로 필터링 가능
- [x] 페이지네이션 동작 (페이지당 20건)
- [x] 데이터 로딩 중 Skeleton UI 표시
- [x] API 오류 시 에러 메시지 표시 (Error Boundary 구현)
- [x] 검색 결과 없을 시 빈 상태 메시지 표시

#### E2E 테스트 필수 (Playwright MCP)

> **이 Phase는 Notion API 연동을 포함하므로 반드시 Playwright MCP E2E 테스트를 수행해야 완료로 인정됩니다.**

| 테스트 케이스    | 검증 항목                                       |
| ---------------- | ----------------------------------------------- |
| 견적서 목록 로드 | 로그인 후 `/invoices` → 목록 데이터 렌더링 확인 |
| 견적서 번호 검색 | 검색어 입력 → 필터링된 결과 표시 확인           |
| 고객명 검색      | 고객명 입력 → 해당 견적서만 표시 확인           |
| 상태 필터링      | 상태 선택 → 해당 상태 견적서만 표시 확인        |
| 페이지네이션     | 다음 페이지 이동 → 다른 데이터 로드 확인        |
| 로딩 상태        | 페이지 로드 시 Skeleton UI 표시 확인            |
| API 오류 처리    | 잘못된 API 키 환경에서 에러 메시지 표시 확인    |
| 빈 검색 결과     | 존재하지 않는 검색어 → 빈 상태 메시지 확인      |

```typescript
// Playwright MCP 테스트 예시
// mcp__playwright__browser_navigate: http://localhost:3000/invoices
// mcp__playwright__browser_snapshot: 견적서 목록 렌더링 확인
// mcp__playwright__browser_fill_form: 검색어 입력
// mcp__playwright__browser_wait_for: 필터링 결과 로드 대기
// mcp__playwright__browser_network_requests: /api/invoices 응답 200 확인
```

#### PR 단위

- `feat/notion-service`: Notion API 서비스 레이어 및 데이터 변환
- `feat/invoices-api`: 견적서 목록 Route Handler 구현
- `feat/invoices-list-ui`: 견적서 목록 테이블 및 검색/필터 컴포넌트
- `feat/invoices-list-page`: 목록 페이지 조립 및 상태 처리

---

### Phase 2: 견적서 상세 조회 및 PDF 다운로드 (F004, F005)

- **목표**: 선택한 견적서의 전체 정보를 표시하고 PDF 다운로드 기능을 완성합니다.
- **예상 기간**: 5일
- **우선순위**: Must Have (클라이언트의 핵심 사용 목적)
- **관련 기능**: F001 (Notion 연동), F004 (상세 조회), F005 (PDF 다운로드)
- **선행 요구사항**: Phase 1 완료

#### 작업 목록

| 작업 | 설명                                                                              | 소요 시간 | 상태 |
| ---- | --------------------------------------------------------------------------------- | --------- | ---- |
| 3-1  | 견적서 단건 조회 Notion 서비스 구현 - 페이지 상세 + 하위 아이템(InvoiceItem) 조회 | 1일       | ✅   |
| 3-2  | 견적서 상세 Route Handler 구현 (`/api/invoices/[id]`)                             | 0.5일     | ✅   |
| 3-3  | 견적서 상세 UI 컴포넌트 구현 - 고객정보, 기본정보, 상품목록, 금액요약, 비고 섹션  | 1.5일     | ✅   |
| 3-4  | PDF 출력용 견적서 레이아웃 컴포넌트 구현 (인쇄 최적화 CSS)                        | 1일       | ✅   |
| 3-5  | html2pdf 라이브러리 연동 및 PDF 다운로드 버튼 구현                                | 1일       | ✅   |

#### 구현 세부 사항

**파일 경로**

```
src/
  app/
    api/
      invoices/
        [id]/
          route.ts              # GET /api/invoices/[id]
  components/
    invoices/
      invoice-detail.tsx        # 견적서 상세 정보 컴포넌트
      invoice-items-table.tsx   # 상품 목록 테이블
      invoice-summary.tsx       # 금액 요약 섹션
      invoice-pdf-template.tsx  # PDF 출력용 템플릿 (인쇄 최적화)
      pdf-download-button.tsx   # PDF 다운로드 버튼 (클라이언트 컴포넌트)
```

**견적서 상세 섹션 구성**

```
[뒤로가기 버튼]   [PDF 다운로드 버튼]

1. 견적서 기본 정보
   - 견적서 번호, 작성일, 유효기간, 상태 배지

2. 고객 정보
   - 고객명, 이메일, 연락처

3. 상품 목록 (테이블)
   - 상품명 | 수량 | 단가 | 금액

4. 금액 요약
   - 소계
   - 세금
   - 총 금액 (통화 단위 포함)

5. 비고
   - Notion 비고 내용
```

**PDF 생성 구현 방식**

```typescript
// 'use client' 컴포넌트에서 html2pdf 동적 import
const handleDownload = async () => {
  const html2pdf = (await import('html2pdf.js')).default
  const element = document.getElementById('invoice-pdf-template')
  html2pdf()
    .set({ filename: `견적서_${invoiceNumber}.pdf`, ... })
    .from(element)
    .save()
}
```

**금액 포맷**

- KRW: `₩1,000,000`
- USD: `$1,000.00`

#### 완료 기준

- [x] `/invoices/[id]` 페이지에서 Notion 견적서 전체 정보가 표시됨 (✅ Phase 1 완료)
- [x] 상품 목록(InvoiceItem)이 테이블로 표시됨 (✅ Phase 2-1~4 완료)
  - Items DB 조회 구현 (items-service.ts)
  - Notion Relations 추출 (transformers.ts)
  - 상품명, 수량, 단가 표시됨
- [x] 소계, 세금, 총 금액이 통화 단위와 함께 표시됨 (✅ Phase 1에서 구현)
- [x] 비고 내용이 표시됨 (✅ Phase 1에서 구현)
- [x] PDF 다운로드 버튼 클릭 시 PDF 파일이 다운로드됨 (✅ Phase 2-5 완료)
- [x] PDF 파일명은 `견적서_INV-XXXX-XXX.pdf` 형식 (✅ Phase 2-5 완료)
- [x] 뒤로가기 버튼 클릭 시 `/invoices` 페이지로 이동

#### E2E 테스트 필수 (Playwright MCP)

> **이 Phase는 Notion API 단건 조회 및 PDF 파일 생성 로직을 포함하므로 반드시 Playwright MCP E2E 테스트를 수행해야 완료로 인정됩니다.**

| 테스트 케이스          | 검증 항목                                          | 상태 |
| ---------------------- | -------------------------------------------------- | ---- |
| 견적서 상세 로드       | 목록에서 클릭 → `/invoices/[id]` 렌더링 확인       | ✅   |
| 기본 정보 표시         | 견적서 번호, 작성일, 유효기간, 상태 배지 표시 확인 | ✅   |
| 상품 목록 표시         | InvoiceItem 테이블 렌더링 확인                     | ✅   |
| 금액 요약 표시         | 소계/세금/총 금액이 통화 단위와 함께 표시 확인     | ✅   |
| PDF 다운로드 버튼 동작 | 버튼 클릭 → 파일 다운로드 트리거 확인              | ✅   |
| PDF 파일명 형식        | `견적서_INV-XXXX-XXX.pdf` 형식으로 저장 확인       | ✅   |
| 뒤로가기 버튼          | 클릭 → `/invoices` 페이지로 이동 확인              | ✅   |
| 존재하지 않는 ID 접근  | 잘못된 ID → 에러 페이지 또는 안내 메시지 표시      | ✅   |

```typescript
// Playwright MCP 테스트 예시
// mcp__playwright__browser_navigate: http://localhost:3000/invoices/[실제ID]
// mcp__playwright__browser_snapshot: 견적서 상세 정보 렌더링 확인
// mcp__playwright__browser_click: PDF 다운로드 버튼
// mcp__playwright__browser_network_requests: /api/invoices/[id] 응답 200 확인
// mcp__playwright__browser_navigate: http://localhost:3000/invoices/invalid-id
// mcp__playwright__browser_snapshot: 에러 처리 확인
```

#### PR 단위

- ✅ `feat/items-db-integration`: Items DB 연동 및 상품 목록 조회 (완료: 2026-04-09)
  - items-service.ts: Items DB 조회 API 구현
  - transformers.ts: Notion Relations 추출 및 InvoiceItem 변환
  - invoice-service.ts: getInvoiceById()에 Items 조회 통합
- ✅ `feat/pdf-download`: PDF 템플릿 및 다운로드 기능 (완료: 2026-04-09)
  - invoice-pdf-template.tsx: PDF용 인쇄 레이아웃 컴포넌트 신규 작성
  - pdf-download-button.tsx: html2canvas + jsPDF 기반 PDF 생성 및 다운로드 로직 구현
  - [id]/page.tsx: PDF 템플릿 통합 및 props 연결

---

### Phase 3: E2E 테스트, QA 및 배포

- **목표**: Playwright MCP를 활용한 전체 사용자 시나리오 E2E 테스트를 완료하고, 검증된 빌드를 프로덕션에 배포합니다.
- **예상 기간**: 3일
- **우선순위**: Must Have
- **선행 요구사항**: Phase 0 ~ Phase 2 완료 (각 Phase E2E 테스트 포함)

> **배포 전제 조건**: 아래 모든 E2E 테스트 시나리오가 Playwright MCP로 통과되어야 배포 작업을 시작할 수 있습니다. Notion API의 유효성과 모든 페이지의 정상 작동을 확인해야 합니다.

#### 작업 목록

| 작업 | 설명                                                                                | 소요 시간 |
| ---- | ----------------------------------------------------------------------------------- | --------- |
| 3-1  | Playwright MCP 전체 E2E 테스트 - 견적서 조회 및 PDF 다운로드 전체 여정              | 0.5일     |
| 3-2  | 에러 시나리오 E2E 테스트 - Notion API 오류, 존재하지 않는 ID, 네트워크 오류         | 0.5일     |
| 3-3  | 반응형 UI 검증 - Playwright MCP로 모바일(375px)/태블릿(768px)/데스크탑(1280px) 검증 | 0.5일     |
| 3-4  | Vercel 또는 동등 플랫폼 배포 설정 및 환경 변수 구성                                 | 0.5일     |
| 3-5  | 프로덕션 배포 후 스모크 테스트 (Playwright MCP)                                     | 0.5일     |

#### E2E 테스트 시나리오 (Playwright MCP 필수)

**시나리오 A: 전체 사용자 여정 (견적서 조회 ~ PDF 다운로드)**

```typescript
// 1. 견적서 목록 페이지 접근
// mcp__playwright__browser_navigate: http://localhost:3000/invoices
// mcp__playwright__browser_snapshot: 견적서 목록이 Notion API로부터 로드됨 확인

// 2. 검색 및 필터링
// mcp__playwright__browser_fill_form: 견적서 번호 검색
// mcp__playwright__browser_wait_for: 필터링 결과 로드
// mcp__playwright__browser_snapshot: 검색어와 일치하는 견적서만 표시 확인

// 3. 필터링 (상태, 날짜 범위)
// mcp__playwright__browser_select_option: 상태 필터 선택
// mcp__playwright__browser_snapshot: 선택된 상태의 견적서만 표시 확인

// 4. 견적서 상세 조회
// mcp__playwright__browser_click: 견적서 행 클릭
// mcp__playwright__browser_wait_for: 상세 페이지 로드
// mcp__playwright__browser_snapshot: 견적서 상세 정보(고객명, 상품목록, 금액) 표시 확인

// 5. PDF 다운로드
// mcp__playwright__browser_click: PDF 다운로드 버튼
// mcp__playwright__browser_network_requests: PDF 생성 요청 확인
// mcp__playwright__browser_snapshot: 다운로드 완료 확인
```

**시나리오 B: 에러 처리 검증**

```typescript
// 1. 존재하지 않는 견적서 ID 접근
// mcp__playwright__browser_navigate: http://localhost:3000/invoices/invalid-id
// mcp__playwright__browser_snapshot: 404 또는 에러 메시지 표시 확인

// 2. 잘못된 검색 결과
// mcp__playwright__browser_navigate: http://localhost:3000/invoices
// mcp__playwright__browser_fill_form: 존재하지 않는 검색어 입력
// mcp__playwright__browser_snapshot: 빈 상태 메시지 표시 확인

// 3. API 오류 상황 (네트워크 오류 시뮬레이션)
// mcp__playwright__browser_snapshot: 에러 바운더리 또는 재시도 옵션 표시 확인
```

**시나리오 C: 반응형 UI 검증**

```typescript
// 모바일 (375px)
// mcp__playwright__browser_resize: width=375, height=812
// mcp__playwright__browser_navigate: http://localhost:3000/invoices
// mcp__playwright__browser_take_screenshot: 모바일 레이아웃 스크린샷

// 태블릿 (768px)
// mcp__playwright__browser_resize: width=768, height=1024
// mcp__playwright__browser_take_screenshot: 태블릿 레이아웃 스크린샷

// 데스크탑 (1280px)
// mcp__playwright__browser_resize: width=1280, height=800
// mcp__playwright__browser_take_screenshot: 데스크탑 레이아웃 스크린샷
```

#### 완료 기준

**E2E 테스트 완료 기준 (배포 전 필수)**

- [ ] 시나리오 A (전체 여정) - 견적서 조회부터 PDF 다운로드까지 Playwright MCP 테스트 통과
- [ ] 시나리오 B (에러 처리) - 모든 에러 케이스에 대한 적절한 UI 응답 확인
- [ ] 시나리오 C (반응형) - 375px/768px/1280px 스크린샷 레이아웃 정상

**정적 검증 기준**

- [ ] `npm run check-all` 통과
- [ ] `npm run build` 에러 없이 성공

**배포 완료 기준**

- [ ] Vercel 환경 변수 설정 완료 (NOTION_API_KEY, NOTION_INVOICE_DATABASE_ID)
- [ ] 프로덕션 URL에서 견적서 조회부터 PDF 다운로드까지 Playwright MCP 스모크 테스트 통과

#### PR 단위

- `feat/error-handling`: 전역 에러 처리 및 에러 UI 개선
- `chore/deploy`: 배포 설정 및 환경 변수 구성

---

## 의존성 및 우선순위 맵

```
Phase 0 (환경 구성)
    ↓
Phase 1 (Notion 연동 + 목록) ← F001, F002, F003
    ↓
Phase 2 (상세 + PDF) ← F001, F004, F005
    ↓
Phase 3 (QA + 배포)
```

### 기능별 의존성 상세

| 기능              | 선행 의존성       | 이유                                |
| ----------------- | ----------------- | ----------------------------------- |
| F001 Notion 연동  | Phase 0 환경 변수 | Notion API Key 필요                 |
| F002 목록 조회    | F001              | 데이터 소스가 Notion                |
| F003 검색/필터링  | F002              | 목록 조회 후 클라이언트/서버 필터링 |
| F004 상세 조회    | F001              | Notion 단건 페이지 조회             |
| F005 PDF 다운로드 | F004              | 상세 정보가 렌더링된 후 PDF 생성    |

---

## 리소스 할당 (1인 개발 기준)

| 역할          | 담당 영역      |
| ------------- | -------------- |
| 풀스택 개발자 | Phase 0~3 전체 |

### 일별 작업 분배 권장

- 오전: 서버 사이드 로직 (API, 서비스 레이어, DB)
- 오후: 클라이언트 사이드 UI (컴포넌트, 폼, 상호작용)
- 마감 전: `npm run check-all` 실행 및 커밋

---

## 위험 요소 및 대응 방안

| 위험 요소                            | 가능성 | 영향도 | 대응 방안                                                               |
| ------------------------------------ | ------ | ------ | ----------------------------------------------------------------------- |
| Notion API 응답 스키마 변경          | 낮음   | 높음   | `transformers.ts`에 방어적 타입 파싱 적용, Zod로 런타임 검증            |
| Notion API 속도 제한 (Rate Limit)    | 중간   | 중간   | 응답 캐싱 적용 (Next.js `cache` 또는 `revalidate`), 에러 시 재시도 로직 |
| html2pdf 복잡한 레이아웃 렌더링 오류 | 중간   | 중간   | PDF 전용 단순화된 템플릿 컴포넌트 분리, 브라우저 Print API 대안 검토    |
| TypeScript 타입 오류로 빌드 실패     | 낮음   | 낮음   | `npm run check-all`을 커밋 전 훅으로 자동 실행 (Husky 설정됨)           |

---

## Git Workflow

### 브랜치 전략

```
main
  └── feat/env-setup              # Phase 0
  └── feat/notion-service         # Phase 1
  └── feat/invoices-api           # Phase 1
  └── feat/invoices-list-ui       # Phase 1
  └── feat/invoices-list-page     # Phase 1
  └── feat/invoice-detail-api     # Phase 2
  └── feat/invoice-detail-ui      # Phase 2
  └── feat/pdf-download           # Phase 2
  └── feat/error-handling         # Phase 3
  └── chore/deploy                # Phase 3
```

### 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
chore: 빌드 설정, 의존성 업데이트
refactor: 기능 변경 없는 코드 개선
docs: 문서 수정
style: 코드 포맷팅
```

### PR 머지 기준

- [ ] `npm run check-all` 통과
- [ ] `npm run build` 성공
- [ ] **API 연동 또는 비즈니스 로직 구현 시 Playwright MCP E2E 테스트 필수 완료**
- [ ] 코드 리뷰 승인 (1인 개발 시 셀프 리뷰)

> Phase별 E2E 테스트 적용 기준:
>
> | Phase   | E2E 테스트 필수 여부 | 비고                                    |
> | ------- | -------------------- | --------------------------------------- |
> | Phase 0 | 수동 검증으로 대체   | 인프라 구성 단계 (Notion API 연결 확인) |
> | Phase 1 | **필수**             | Notion API 연동 (목록 조회/검색/필터)   |
> | Phase 2 | **필수**             | Notion API 연동 + PDF 생성 로직         |
> | Phase 3 | **필수**             | 전체 사용자 여정 종합 테스트 및 배포    |

---

## MVP 이후 백로그 (Post-MVP)

다음 기능들은 MVP 범위에서 제외되며 향후 개발 시 우선순위를 검토합니다.

| 기능           | 설명                                          | 예상 복잡도 |
| -------------- | --------------------------------------------- | ----------- |
| 이메일 발송    | 견적서 링크를 클라이언트에게 이메일 발송      | 중간        |
| 견적서 편집    | 웹에서 견적서 내용 수정 (현재는 Notion에서만) | 높음        |
| 댓글 및 메모   | 견적서에 내부 메모 또는 클라이언트 댓글 추가  | 중간        |
| 알림 기능      | 견적서 만료 임박 이메일/웹 알림               | 중간        |
| 고급 리포트    | 월별/고객별 견적서 통계 대시보드              | 높음        |
| 다중 통화 환율 | USD/KRW 실시간 환율 자동 계산                 | 중간        |
| 프로필 관리    | 사용자 이름, 비밀번호 변경 페이지             | 낮음        |
