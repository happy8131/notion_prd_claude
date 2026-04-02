# 노션 기반 견적서 웹 애플리케이션 개발 로드맵

## 개요

### 프로젝트 비전

Notion 데이터베이스를 단일 데이터 소스(Single Source of Truth)로 활용하여, 영업팀이 작성한 견적서를 클라이언트가 웹에서 조회하고 PDF로 다운로드할 수 있는 경량 견적서 포털을 구축합니다.

### 주요 목표

- Notion API 연동을 통한 실시간 견적서 데이터 제공
- Supabase 기반의 안전한 사용자 인증 및 역할별 접근 제어
- 클라이언트가 견적서를 즉시 PDF로 다운로드할 수 있는 사용자 경험 제공
- Next.js 15 App Router 기반의 모던 웹 아키텍처 구현

### 기술 스택 요약

| 분류         | 기술                                    |
| ------------ | --------------------------------------- |
| Framework    | Next.js 15.5.3 (App Router + Turbopack) |
| Runtime      | React 19.1.0 + TypeScript 5.6+          |
| Styling      | TailwindCSS v4 + shadcn/ui (new-york)   |
| Auth & DB    | Supabase Auth + Supabase PostgreSQL     |
| External API | Notion API (@notionhq/client)           |
| PDF          | html2pdf                                |
| Forms        | React Hook Form 7.x + Zod               |

### 예상 완료 기간

**총 4주** (2026년 4월 2일 기준)

| 페이즈                              | 기간 | 완료 목표일 |
| ----------------------------------- | ---- | ----------- |
| Phase 0: 환경 구성                  | 2일  | 2026-04-03  |
| Phase 1: 인증 시스템                | 5일  | 2026-04-10  |
| Phase 2: Notion 연동 및 견적서 목록 | 7일  | 2026-04-17  |
| Phase 3: 견적서 상세 및 PDF         | 5일  | 2026-04-24  |
| Phase 4: 접근 제어 및 유효성 표시   | 3일  | 2026-04-27  |
| Phase 5: QA 및 배포                 | 3일  | 2026-04-30  |

---

## 현재 구현 상태 (2026-04-02 기준)

> 이미 완료된 기반 작업을 정리합니다. 각 페이즈 계획은 이 상태를 기준으로 시작합니다.

### 완료된 작업

- [x] Next.js 15.5.3 + React 19 + TypeScript 프로젝트 초기화
- [x] TailwindCSS v4 + shadcn/ui (new-york) 설정
- [x] ESLint + Prettier + Husky + lint-staged 개발 도구 설정
- [x] Supabase SSR 클라이언트 설정 (`src/lib/supabase/client.ts`, `server.ts`)
- [x] Notion API 클라이언트 설정 (`src/lib/notion/client.ts`)
- [x] Next.js 미들웨어 구성 - 인증 라우팅 및 세션 갱신 (`src/middleware.ts`)
- [x] 공통 TypeScript 타입 정의 (`src/types/index.ts`) - User, Invoice, InvoiceItem, API 응답 타입
- [x] Zod 유효성 검사 스키마 정의 (`src/lib/validations/auth.ts`, `invoice.ts`)
- [x] 로그인 폼 UI 컴포넌트 (`src/components/auth/login-form.tsx`) - 서버 액션 연동 미완료
- [x] 회원가입 폼 UI 컴포넌트 (`src/components/auth/signup-form.tsx`) - 서버 액션 연동 미완료
- [x] 페이지 라우팅 구조 - `/login`, `/signup`, `/invoices`, `/invoices/[id]`
- [x] 페이지 셸(Shell) 생성 - 각 페이지 레이아웃 및 TODO 주석 포함

---

## 페이즈별 계획

---

### Phase 0: 환경 구성 및 외부 서비스 연결

- **목표**: 개발 환경을 완성하고 Supabase, Notion 외부 서비스와 실제 연결을 검증합니다.
- **예상 기간**: 2일
- **우선순위**: Must Have (이후 모든 페이즈의 전제 조건)
- **관련 기능**: 없음 (인프라)

#### 작업 목록

| 작업 | 설명                                                                 | 소요 시간 |
| ---- | -------------------------------------------------------------------- | --------- |
| 0-1  | `.env.local` 환경 변수 설정 (Supabase URL/Key, Notion API Key/DB ID) | 0.5일     |
| 0-2  | Supabase 프로젝트 생성 및 `users` 테이블 스키마 마이그레이션         | 0.5일     |
| 0-3  | Notion 견적서 데이터베이스 스키마 확인 및 샘플 데이터 입력           | 0.5일     |
| 0-4  | 연결 검증 - Supabase Auth 테스트, Notion API 응답 확인               | 0.5일     |

#### 환경 변수 목록

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NOTION_API_KEY=
NOTION_INVOICE_DATABASE_ID=
```

#### Supabase `users` 테이블 스키마

```sql
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('SALES', 'CLIENT')),
  customer_name TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

#### 완료 기준

- [ ] `npm run dev` 실행 시 에러 없이 앱이 시작됨
- [ ] Supabase 대시보드에서 `users` 테이블이 생성됨
- [ ] Notion API 호출 테스트 스크립트가 정상 응답을 반환함
- [ ] 미들웨어가 비인증 접근을 `/login`으로 올바르게 리다이렉트함

#### PR 단위

- `feat/env-setup`: 환경 변수 설정 및 외부 서비스 연결 검증

---

### Phase 1: 인증 시스템 구현 (F010)

- **목표**: Supabase Auth를 사용하여 회원가입, 로그인, 로그아웃 기능을 완전히 구현합니다.
- **예상 기간**: 5일
- **우선순위**: Must Have (모든 보호된 페이지의 전제 조건)
- **관련 기능**: F010 (기본 인증)
- **선행 요구사항**: Phase 0 완료

#### 작업 목록

| 작업 | 설명                                                                           | 소요 시간 |
| ---- | ------------------------------------------------------------------------------ | --------- |
| 1-1  | Supabase Auth 서버 액션 구현 - `signIn`, `signUp`, `signOut`                   | 1일       |
| 1-2  | 회원가입 서버 액션 연동 - `signup-form.tsx`에 실제 Supabase 호출 연결          | 0.5일     |
| 1-3  | 로그인 서버 액션 연동 - `login-form.tsx`에 실제 Supabase 호출 연결             | 0.5일     |
| 1-4  | 회원가입 시 `users` 테이블 프로파일 자동 생성 (Supabase 트리거 또는 서버 액션) | 1일       |
| 1-5  | 헤더/레이아웃 컴포넌트 구현 - 로그인 상태 표시 및 로그아웃 버튼                | 1일       |
| 1-6  | 인증 상태 Provider 설정 - 클라이언트 컴포넌트에서 사용자 정보 접근             | 0.5일     |
| 1-7  | 인증 흐름 E2E 테스트 (수동)                                                    | 0.5일     |

#### 구현 세부 사항

**서버 액션 파일 경로**

```
src/
  app/
    actions/
      auth.ts          # signIn, signUp, signOut 서버 액션
  components/
    layout/
      header.tsx       # 앱 공통 헤더 (로그인 상태, 로그아웃)
    providers/
      auth-provider.tsx  # 클라이언트 인증 컨텍스트
```

**회원가입 역할 처리**

- 역할이 `CLIENT`인 경우 `customer_name` 필드 필수 입력
- 역할이 `SALES`인 경우 `customer_name` 필드 숨김

**로그인/회원가입 리다이렉트**

- 로그인 성공 → `/invoices`
- 회원가입 성공 → `/login` (이메일 인증 안내 메시지 표시)
- 로그아웃 → `/login`

#### 완료 기준

- [ ] 이메일/비밀번호로 회원가입 가능 (SALES/CLIENT 역할 선택)
- [ ] 회원가입 후 Supabase `users` 테이블에 프로파일 레코드 생성
- [ ] 이메일/비밀번호로 로그인 가능
- [ ] 로그인 후 `/invoices`로 리다이렉트
- [ ] 헤더에 로그인한 사용자 이름 표시
- [ ] 로그아웃 후 `/login`으로 리다이렉트
- [ ] 비인증 상태에서 `/invoices` 접근 시 `/login`으로 리다이렉트
- [ ] 인증 상태에서 `/login` 접근 시 `/invoices`로 리다이렉트

#### PR 단위

- `feat/auth-server-actions`: 서버 액션 구현 (signIn, signUp, signOut)
- `feat/auth-ui-integration`: 폼 컴포넌트와 서버 액션 연동
- `feat/auth-layout`: 헤더 및 레이아웃 컴포넌트 구현

---

### Phase 2: Notion 연동 및 견적서 목록 구현 (F001, F002, F003)

- **목표**: Notion API를 통해 견적서 데이터를 가져오고, 검색/필터링이 가능한 목록 페이지를 완성합니다.
- **예상 기간**: 7일
- **우선순위**: Must Have (핵심 데이터 레이어)
- **관련 기능**: F001 (Notion 데이터 연동), F002 (견적서 목록 조회), F003 (검색 및 필터링)
- **선행 요구사항**: Phase 1 완료, Notion 데이터베이스에 샘플 데이터 존재

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

- [ ] `/invoices` 페이지에서 Notion 데이터베이스의 견적서 목록이 표시됨
- [ ] 견적서 번호 또는 고객명으로 검색 가능
- [ ] 상태, 날짜 범위, 통화로 필터링 가능
- [ ] 페이지네이션 동작 (페이지당 20건)
- [ ] 데이터 로딩 중 Skeleton UI 표시
- [ ] API 오류 시 에러 메시지 표시
- [ ] 검색 결과 없을 시 빈 상태 메시지 표시

#### PR 단위

- `feat/notion-service`: Notion API 서비스 레이어 및 데이터 변환
- `feat/invoices-api`: 견적서 목록 Route Handler 구현
- `feat/invoices-list-ui`: 견적서 목록 테이블 및 검색/필터 컴포넌트
- `feat/invoices-list-page`: 목록 페이지 조립 및 상태 처리

---

### Phase 3: 견적서 상세 조회 및 PDF 다운로드 (F004, F005)

- **목표**: 선택한 견적서의 전체 정보를 표시하고 PDF 다운로드 기능을 완성합니다.
- **예상 기간**: 5일
- **우선순위**: Must Have (클라이언트의 핵심 사용 목적)
- **관련 기능**: F001 (Notion 연동), F004 (상세 조회), F005 (PDF 다운로드)
- **선행 요구사항**: Phase 2 완료

#### 작업 목록

| 작업 | 설명                                                                              | 소요 시간 |
| ---- | --------------------------------------------------------------------------------- | --------- |
| 3-1  | 견적서 단건 조회 Notion 서비스 구현 - 페이지 상세 + 하위 아이템(InvoiceItem) 조회 | 1일       |
| 3-2  | 견적서 상세 Route Handler 구현 (`/api/invoices/[id]`)                             | 0.5일     |
| 3-3  | 견적서 상세 UI 컴포넌트 구현 - 고객정보, 기본정보, 상품목록, 금액요약, 비고 섹션  | 1.5일     |
| 3-4  | PDF 출력용 견적서 레이아웃 컴포넌트 구현 (인쇄 최적화 CSS)                        | 1일       |
| 3-5  | html2pdf 라이브러리 연동 및 PDF 다운로드 버튼 구현                                | 1일       |

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

- [ ] `/invoices/[id]` 페이지에서 Notion 견적서 전체 정보가 표시됨
- [ ] 상품 목록(InvoiceItem)이 테이블로 표시됨
- [ ] 소계, 세금, 총 금액이 통화 단위와 함께 표시됨
- [ ] 비고 내용이 표시됨
- [ ] PDF 다운로드 버튼 클릭 시 PDF 파일이 다운로드됨
- [ ] PDF 파일명은 `견적서_INV-XXXX-XXX.pdf` 형식
- [ ] 뒤로가기 버튼 클릭 시 `/invoices` 페이지로 이동

#### PR 단위

- `feat/invoice-detail-api`: 견적서 상세 Notion 서비스 및 Route Handler
- `feat/invoice-detail-ui`: 견적서 상세 UI 컴포넌트
- `feat/pdf-download`: PDF 템플릿 및 다운로드 기능

---

### Phase 4: 역할 기반 접근 제어 및 유효성 표시 (F011, F012)

- **목표**: 사용자 역할에 따른 데이터 접근 제어를 구현하고, 견적서 유효기간 기반 상태 시각화를 완성합니다.
- **예상 기간**: 3일
- **우선순위**: Must Have (보안 및 데이터 개인정보 보호)
- **관련 기능**: F011 (역할 기반 접근 제어), F012 (견적서 유효성 표시)
- **선행 요구사항**: Phase 2, Phase 3 완료

#### 작업 목록

| 작업 | 설명                                                                                      | 소요 시간 |
| ---- | ----------------------------------------------------------------------------------------- | --------- |
| 4-1  | Supabase 서버 클라이언트에서 현재 사용자 역할 조회 유틸리티 구현                          | 0.5일     |
| 4-2  | 견적서 목록 API에 역할별 필터링 적용 - CLIENT는 자신의 `customer_name` 매칭 견적서만 반환 | 0.5일     |
| 4-3  | 견적서 상세 API에 접근 권한 검증 추가 - CLIENT가 타 고객 견적서 직접 URL 접근 시 403 처리 | 0.5일     |
| 4-4  | 유효기간 기반 상태 계산 유틸리티 구현 (`isExpired`, `isExpiringSoon` 함수)                | 0.5일     |
| 4-5  | 목록 페이지 상태 시각화 - 유효(녹색), 만료 임박(주황), 만료(회색) 아이콘/배지             | 0.5일     |
| 4-6  | 상세 페이지 상태 시각화 및 만료 경고 배너 구현                                            | 0.5일     |

#### 구현 세부 사항

**역할별 데이터 접근 정책**

| 역할   | 견적서 목록                                                       | 견적서 상세             |
| ------ | ----------------------------------------------------------------- | ----------------------- |
| SALES  | 모든 견적서 조회 가능                                             | 모든 견적서 접근 가능   |
| CLIENT | `customer_name`이 자신의 `customer_name`과 일치하는 견적서만 조회 | 본인 견적서만 접근 가능 |

**유효성 상태 기준**

```typescript
// 유효기간 기준 상태 판단
const today = new Date()
const expiry = new Date(expiryDate)
const daysUntilExpiry = differenceInDays(expiry, today)

if (daysUntilExpiry < 0) return 'EXPIRED' // 만료됨 (회색)
if (daysUntilExpiry <= 7) return 'EXPIRING' // 7일 이내 만료 임박 (주황)
return 'VALID' // 유효 (녹색)
```

**상태 시각화 컴포넌트**

```
src/
  components/
    invoices/
      invoice-status-badge.tsx  # 상태 배지 (DRAFT/SENT/ACCEPTED/EXPIRED)
      validity-indicator.tsx    # 유효기간 표시 아이콘
```

#### 완료 기준

- [ ] SALES 역할 사용자는 모든 고객의 견적서를 조회할 수 있음
- [ ] CLIENT 역할 사용자는 본인 `customer_name`과 일치하는 견적서만 조회됨
- [ ] CLIENT가 타 고객 견적서 URL 직접 접근 시 접근 거부 메시지 표시
- [ ] 유효한 견적서는 녹색 인디케이터 표시
- [ ] 만료 7일 이내 견적서는 주황색 경고 표시
- [ ] 만료된 견적서는 회색으로 표시되며 만료 배지 노출
- [ ] 상세 페이지에서 만료 임박/만료된 견적서에 경고 배너 표시

#### PR 단위

- `feat/role-based-access`: 역할 기반 API 필터링 및 접근 제어
- `feat/validity-display`: 유효성 상태 시각화 컴포넌트

---

### Phase 5: QA, 성능 최적화 및 배포

- **목표**: 전체 기능을 검증하고 프로덕션 환경에 배포합니다.
- **예상 기간**: 3일
- **우선순위**: Must Have
- **선행 요구사항**: Phase 0 ~ Phase 4 완료

#### 작업 목록

| 작업 | 설명                                                                      | 소요 시간 |
| ---- | ------------------------------------------------------------------------- | --------- |
| 5-1  | 전체 사용자 시나리오 수동 테스트 (영업팀 여정, 클라이언트 여정)           | 1일       |
| 5-2  | 에러 상황 처리 검증 - Notion API 오류, Supabase 연결 실패, 잘못된 ID 접근 | 0.5일     |
| 5-3  | 반응형 UI 검증 - 모바일/태블릿/데스크탑                                   | 0.5일     |
| 5-4  | Vercel 또는 동등 플랫폼 배포 설정 및 환경 변수 구성                       | 0.5일     |
| 5-5  | 프로덕션 배포 후 스모크 테스트                                            | 0.5일     |

#### 테스트 시나리오

**영업팀 시나리오**

1. 영업팀 계정으로 로그인
2. 견적서 목록에서 모든 고객의 견적서가 표시됨 확인
3. 검색 및 필터링 동작 확인
4. 특정 견적서 클릭 후 상세 정보 확인
5. PDF 다운로드 동작 확인
6. 로그아웃

**클라이언트 시나리오**

1. 클라이언트 계정으로 로그인
2. 본인 고객명의 견적서만 목록에 표시됨 확인
3. 타 고객 견적서 URL 직접 접근 시 접근 거부 확인
4. 본인 견적서 상세 조회 확인
5. PDF 다운로드 확인
6. 만료된 견적서 상태 표시 확인

#### 완료 기준

- [ ] 영업팀/클라이언트 전체 시나리오 오류 없이 동작
- [ ] Notion API 오류 시 사용자 친화적 에러 메시지 표시
- [ ] 모바일(375px) 기준 레이아웃 깨짐 없음
- [ ] `npm run build` 에러 없이 성공
- [ ] `npm run check-all` 통과
- [ ] 프로덕션 URL에서 로그인부터 PDF 다운로드까지 동작 확인

#### PR 단위

- `feat/error-handling`: 전역 에러 처리 및 에러 UI 개선
- `chore/deploy`: 배포 설정 및 환경 변수 구성

---

## 의존성 및 우선순위 맵

```
Phase 0 (환경 구성)
    ↓
Phase 1 (인증 시스템) ← F010
    ↓
Phase 2 (Notion 연동 + 목록) ← F001, F002, F003
    ↓
Phase 3 (상세 + PDF) ← F001, F004, F005
    ↓
Phase 4 (접근 제어 + 유효성) ← F011, F012
    ↓
Phase 5 (QA + 배포)
```

### 기능별 의존성 상세

| 기능              | 선행 의존성       | 이유                                |
| ----------------- | ----------------- | ----------------------------------- |
| F001 Notion 연동  | Phase 0 환경 변수 | Notion API Key 필요                 |
| F002 목록 조회    | F001              | 데이터 소스가 Notion                |
| F003 검색/필터링  | F002              | 목록 조회 후 클라이언트/서버 필터링 |
| F004 상세 조회    | F001              | Notion 단건 페이지 조회             |
| F005 PDF 다운로드 | F004              | 상세 정보가 렌더링된 후 PDF 생성    |
| F010 인증         | Phase 0 Supabase  | Supabase Auth 필요                  |
| F011 접근 제어    | F010, F002, F004  | 인증된 사용자 역할 정보 필요        |
| F012 유효성 표시  | F002, F004        | 견적서 유효기간 데이터 필요         |

---

## 리소스 할당 (1인 개발 기준)

| 역할          | 담당 영역      |
| ------------- | -------------- |
| 풀스택 개발자 | Phase 0~5 전체 |

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
| Supabase RLS 정책 설정 오류          | 낮음   | 높음   | 개발 단계에서 Supabase 대시보드로 정책 검증, 역할별 테스트 계정 활용    |
| CLIENT 역할의 `customer_name` 불일치 | 중간   | 높음   | Notion 고객명과 Supabase `customer_name` 대소문자/공백 정규화 처리      |
| TypeScript 타입 오류로 빌드 실패     | 낮음   | 낮음   | `npm run check-all`을 커밋 전 훅으로 자동 실행 (Husky 설정됨)           |

---

## Git Workflow

### 브랜치 전략

```
main
  └── feat/env-setup              # Phase 0
  └── feat/auth-server-actions    # Phase 1
  └── feat/auth-ui-integration    # Phase 1
  └── feat/auth-layout            # Phase 1
  └── feat/notion-service         # Phase 2
  └── feat/invoices-api           # Phase 2
  └── feat/invoices-list-ui       # Phase 2
  └── feat/invoices-list-page     # Phase 2
  └── feat/invoice-detail-api     # Phase 3
  └── feat/invoice-detail-ui      # Phase 3
  └── feat/pdf-download           # Phase 3
  └── feat/role-based-access      # Phase 4
  └── feat/validity-display       # Phase 4
  └── feat/error-handling         # Phase 5
  └── chore/deploy                # Phase 5
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
- [ ] 관련 기능 수동 테스트 완료
- [ ] 코드 리뷰 승인 (1인 개발 시 셀프 리뷰)

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
