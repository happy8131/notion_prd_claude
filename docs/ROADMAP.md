# 노션 기반 견적서 웹 애플리케이션 개발 로드맵

Notion 데이터베이스를 단일 데이터 소스로 활용하여, 영업팀이 작성한 견적서를 클라이언트가 웹에서 조회하고 PDF로 다운로드할 수 있는 견적서 포털입니다.

## 개요

**Invoice Web**은 영업팀과 클라이언트를 위한 견적서 관리 포털로 다음 기능을 제공합니다:

- **Notion 연동**: Notion 데이터베이스에서 견적서 데이터를 실시간으로 조회
- **견적서 조회**: 검색, 필터링, 페이지네이션이 포함된 목록 및 상세 조회
- **PDF 다운로드**: 견적서를 PDF 형식으로 다운로드
- **관리자 대시보드**: 영업팀 전용 관리 화면에서 견적서 관리 및 공유 링크 생성
- **다크모드**: 사용자 선호에 따른 테마 전환

### 기술 스택

| 분류         | 기술                                    |
| ------------ | --------------------------------------- |
| Framework    | Next.js 15.5.3 (App Router + Turbopack) |
| Runtime      | React 19.1.0 + TypeScript 5.6+          |
| Styling      | TailwindCSS v4 + shadcn/ui (new-york)   |
| Auth         | Supabase Auth                           |
| External API | Notion API (@notionhq/client)           |
| PDF          | html2canvas + jsPDF                     |
| Forms        | React Hook Form 7.x + Zod               |

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료 표시로 갱신

---

## MVP 완료 상태 요약 (Phase 0~3)

> **MVP 개발 완료** - 2026년 4월 11일 기준, Phase 0~3이 모두 완료되었습니다.
> 상세 내용은 `docs/roadmaps/ROADMAP_v1.md`를 참조하세요.

### 완료된 핵심 기능

| 기능 ID | 기능명             | 상태 | 관련 Phase |
| ------- | ------------------ | ---- | ---------- |
| F001    | Notion 데이터 연동 | 완료 | Phase 1    |
| F002    | 견적서 목록 조회   | 완료 | Phase 1    |
| F003    | 검색 및 필터링     | 완료 | Phase 1    |
| F004    | 견적서 상세 조회   | 완료 | Phase 2    |
| F005    | PDF 다운로드       | 완료 | Phase 2    |
| F010    | 기본 인증 (UI)     | 완료 | Phase 1    |

### 완료된 Phase 요약

- **Phase 0: 환경 구성** - Notion API 연결, 환경 변수 설정, 프로젝트 초기화
- **Phase 1: Notion 연동 및 견적서 목록** - 목록 조회, 검색/필터링, 페이지네이션, Skeleton UI
- **Phase 2: 견적서 상세 및 PDF** - 상세 조회, 상품 목록, 금액 요약, PDF 다운로드
- **Phase 3: E2E 테스트 및 배포** - Playwright MCP 테스트, 빌드 검증, 반응형 UI 검증

### 현재 프로젝트 구조

```
src/
  app/
    api/invoices/route.ts           # GET /api/invoices (목록 조회)
    invoices/page.tsx               # 견적서 목록 페이지
    invoices/[id]/page.tsx          # 견적서 상세 페이지
    invoices/error.tsx              # 에러 바운더리
    login/page.tsx                  # 로그인 페이지
    signup/page.tsx                 # 회원가입 페이지
    layout.tsx                      # 루트 레이아웃
    page.tsx                        # 홈 (리디렉트)
  components/
    auth/                           # 인증 관련 컴포넌트
    invoices/                       # 견적서 관련 컴포넌트 (11개)
    providers/theme-provider.tsx    # 테마 프로바이더
    ui/                             # shadcn/ui 컴포넌트 (18개)
  lib/
    notion/                         # Notion API 서비스 레이어
    supabase/                       # Supabase 클라이언트
    utils.ts                        # 유틸리티 함수
```

### 미완료 항목 (MVP에서 이월)

- Supabase 인증 연동 (UI는 완료, 실제 로직 TODO)
- 미들웨어 인증 리디렉트 (현재 pass-through)
- 역할 기반 접근 제어 (F011 - 로직 미구현)

---

## 개발 단계

---

### Phase 4: 고도화 - 관리자 대시보드, 공유 기능, 다크모드

- **목표**: 관리자 전용 레이아웃으로 견적서를 관리하고, 클라이언트 공유 링크 생성 기능과 다크모드를 추가합니다.
- **예상 기간**: 2~3주
- **우선순위**: Should Have (사용성 개선 및 운영 효율화)
- **선행 요구사항**: Phase 0~3 완료 (MVP)

#### 의존성 맵

```
Task 401 (다크모드)          ← 독립 작업, 병렬 가능
Task 402 (관리자 레이아웃)   ← 독립 작업, 병렬 가능
Task 403 (관리자 견적서 목록) ← Task 402 의존
Task 404 (공유 링크)         ← Task 403 의존
Task 405 (공유 페이지)       ← Task 404 의존
Task 406 (통합 테스트)       ← Task 401~405 전체 의존
```

---

#### Task 401: 다크모드 테마 시스템 구현 - 우선순위

- **범위**: 전역 테마 전환 기능 (라이트/다크/시스템)
- **예상 기간**: 2~3일
- **의존성**: 없음 (독립 작업, 병렬 개발 가능)
- **관련 파일**: `src/components/providers/theme-provider.tsx` (기존 파일 활용)

##### 구현 사항

- `next-themes` 패키지 설치 및 ThemeProvider 설정
- 루트 레이아웃(`layout.tsx`)에 ThemeProvider 래핑
- 테마 토글 버튼 컴포넌트 구현 (`components/ui/theme-toggle.tsx`)
  - 라이트 / 다크 / 시스템 3가지 모드 지원
  - 드롭다운 메뉴 또는 토글 버튼 UI
  - Lucide 아이콘 (Sun/Moon/Monitor) 활용
- TailwindCSS v4 다크모드 CSS 변수 설정
  - `globals.css`에 다크모드 색상 변수 정의
  - shadcn/ui 컴포넌트 다크모드 호환 확인
- 기존 모든 페이지 다크모드 스타일 적용 및 검증
  - 견적서 목록 페이지
  - 견적서 상세 페이지
  - 로그인/회원가입 페이지
- PDF 템플릿은 다크모드 영향 제외 (항상 라이트 모드로 출력)

##### 완료 기준

- [ ] 테마 토글 버튼이 헤더에 표시되고 클릭 시 테마가 전환됨
- [ ] 브라우저 새로고침 후에도 선택한 테마가 유지됨 (localStorage)
- [ ] 시스템 설정 모드 선택 시 OS 다크모드에 연동됨
- [ ] 모든 기존 페이지에서 다크모드 레이아웃이 깨지지 않음
- [ ] PDF 다운로드 시 항상 라이트 모드로 출력됨
- [ ] `npm run build` 에러 없이 성공

##### PR 단위

- `feat/dark-mode`: next-themes 설정, 테마 토글 컴포넌트, 다크모드 CSS 변수

---

#### Task 402: 관리자 레이아웃 및 라우팅 구축 - 우선순위

- **범위**: `/admin` 경로 하위 관리자 전용 레이아웃 및 네비게이션 구조 생성
- **예상 기간**: 2~3일
- **의존성**: 없음 (독립 작업, 병렬 개발 가능)

##### 구현 사항

- `/admin` 라우트 그룹 생성 및 관리자 레이아웃 구현
  - `src/app/admin/layout.tsx` - 관리자 전용 레이아웃
  - `src/app/admin/page.tsx` - 관리자 대시보드 (리디렉트 또는 요약)
- 사이드바 네비게이션 컴포넌트 구현
  - `src/components/admin/admin-sidebar.tsx`
  - 메뉴 항목: 대시보드, 견적서 관리
  - 반응형: 데스크탑은 사이드바, 모바일은 Sheet(드로어)
- 관리자 헤더 컴포넌트 구현
  - `src/components/admin/admin-header.tsx`
  - 사용자 정보 표시, 테마 토글, 로그아웃 버튼
- 기존 `/invoices` 경로와 `/admin` 경로 공존 구조 설계
  - `/invoices` - 클라이언트용 (기존 유지)
  - `/admin/invoices` - 관리자용 (신규)
- 관리자 페이지 빈 껍데기(Shell) 생성
  - `src/app/admin/invoices/page.tsx` - 견적서 관리 페이지 셸

##### 완료 기준

- [ ] `/admin` 경로 접근 시 사이드바가 있는 관리자 레이아웃이 표시됨
- [ ] 사이드바 네비게이션이 정상 동작함 (메뉴 클릭 시 페이지 이동)
- [ ] 모바일에서 사이드바가 Sheet(드로어)로 전환됨
- [ ] 기존 `/invoices` 경로가 영향받지 않고 정상 동작함
- [ ] 다크모드가 관리자 레이아웃에서도 정상 적용됨 (Task 401 완료 후)
- [ ] `npm run build` 에러 없이 성공

##### PR 단위

- `feat/admin-layout`: 관리자 라우팅, 레이아웃, 사이드바, 헤더 구현

---

#### Task 403: 관리자 견적서 목록 페이지 구현

- **범위**: 관리자 레이아웃 내 견적서 목록 조회 및 관리 기능
- **예상 기간**: 3~4일
- **의존성**: Task 402 (관리자 레이아웃)

##### 구현 사항

- 관리자 견적서 목록 페이지 구현 (`src/app/admin/invoices/page.tsx`)
  - 기존 견적서 목록 컴포넌트 재사용 또는 확장
  - 관리자 전용 컬럼 추가: 공유 링크 복사 버튼, 액션 드롭다운
- 견적서 목록 테이블 관리자 확장 컴포넌트
  - `src/components/admin/admin-invoice-table.tsx`
  - 기존 `invoice-list-table.tsx` 기반으로 관리자 전용 기능 추가
  - 각 행에 "링크 복사" 아이콘 버튼 표시
  - 각 행에 액션 드롭다운 (상세 보기, 링크 복사)
- 대시보드 요약 카드 컴포넌트 (선택 사항)
  - `src/components/admin/dashboard-stats.tsx`
  - 전체 견적서 수, 상태별 개수, 최근 견적서 요약
- 검색/필터링 기능은 기존 컴포넌트 재사용
  - `invoice-filter-bar.tsx` 그대로 활용

##### 완료 기준

- [ ] `/admin/invoices` 페이지에서 전체 견적서 목록이 표시됨
- [ ] 기존 검색/필터링 기능이 관리자 페이지에서도 동작함
- [ ] 각 견적서 행에 "링크 복사" 버튼이 표시됨
- [ ] 테이블이 반응형으로 모바일에서도 사용 가능함
- [ ] `npm run build` 에러 없이 성공

##### PR 단위

- `feat/admin-invoices`: 관리자 견적서 목록, 테이블 확장, 대시보드 카드

---

#### Task 404: 클라이언트 공유 링크 생성 및 복사 기능

- **범위**: 견적서별 고유 공유 URL 생성 및 클립보드 복사 기능
- **예상 기간**: 2~3일
- **의존성**: Task 403 (관리자 견적서 목록)

##### 구현 사항

- 공유 링크 URL 스키마 설계
  - 형식: `/share/invoices/[id]` 또는 `/invoices/[id]?share=true`
  - 공유 링크는 인증 없이 접근 가능한 공개 경로
- 공유 링크 복사 버튼 컴포넌트 구현
  - `src/components/admin/copy-share-link-button.tsx`
  - `navigator.clipboard.writeText()` API 활용
  - 복사 성공 시 토스트 알림 (sonner 활용)
  - 복사 실패 시 폴백 처리 (input select + document.execCommand)
- 공유 링크 복사 유틸리티 함수
  - `src/lib/share.ts` - 공유 URL 생성 로직
  - 환경별 base URL 처리 (dev/production)
- 관리자 견적서 목록에 공유 링크 복사 버튼 통합
  - 각 행의 액션 영역에 복사 버튼 배치
  - 복사 아이콘 (Link/Copy) 및 호버 툴팁

##### 테스트 체크리스트

| 테스트 케이스  | 검증 항목                                        |
| -------------- | ------------------------------------------------ |
| 링크 복사 동작 | 복사 버튼 클릭 시 클립보드에 공유 URL이 복사됨   |
| 토스트 알림    | 복사 성공 시 "링크가 복사되었습니다" 토스트 표시 |
| 공유 URL 형식  | 복사된 URL이 올바른 형식인지 확인                |
| 공유 링크 접근 | 복사된 URL로 접근 시 견적서 상세 페이지가 표시됨 |

##### 완료 기준

- [ ] 관리자 견적서 목록에서 "링크 복사" 버튼 클릭 시 공유 URL이 클립보드에 복사됨
- [ ] 복사 성공 시 토스트 알림이 표시됨
- [ ] 복사된 공유 URL이 올바른 형식이고 접근 가능함
- [ ] Playwright MCP로 복사 및 공유 링크 접근 테스트 통과

##### PR 단위

- `feat/share-link`: 공유 URL 생성, 클립보드 복사, 토스트 알림

---

#### Task 405: 공유 전용 견적서 페이지 구현

- **범위**: 인증 없이 접근 가능한 공유 전용 견적서 상세 페이지
- **예상 기간**: 2~3일
- **의존성**: Task 404 (공유 링크 기능)

##### 구현 사항

- 공유 전용 라우트 생성
  - `src/app/share/invoices/[id]/page.tsx` - 공유 전용 견적서 페이지
  - `src/app/share/layout.tsx` - 공유 전용 레이아웃 (심플 헤더, 로그인 불필요)
- 공유 전용 견적서 상세 컴포넌트
  - 기존 `invoice-detail.tsx` 컴포넌트 재사용
  - 관리자 전용 기능(편집, 삭제 등) 제외
  - PDF 다운로드 버튼 포함
  - "견적서 포털 바로가기" 링크 표시 (로그인 유도)
- 공유 페이지 미들웨어 처리
  - `/share/*` 경로는 인증 미들웨어에서 제외
  - Notion API 직접 조회로 데이터 로드
- 공유 페이지 메타데이터 설정
  - Open Graph 태그 설정 (미리보기용 제목, 설명)
  - 견적서 번호와 고객명을 메타데이터에 포함

##### 테스트 체크리스트

| 테스트 케이스    | 검증 항목                                             |
| ---------------- | ----------------------------------------------------- |
| 비인증 접근      | 로그인하지 않은 상태에서 공유 URL 접근 시 페이지 표시 |
| 견적서 정보 표시 | 공유 페이지에서 견적서 상세 정보가 정상 표시됨        |
| PDF 다운로드     | 공유 페이지에서 PDF 다운로드가 정상 동작함            |
| 잘못된 ID 처리   | 존재하지 않는 견적서 ID 접근 시 에러 페이지 표시      |
| OG 메타데이터    | 공유 URL의 OG 태그가 올바르게 설정됨                  |

##### 완료 기준

- [ ] `/share/invoices/[id]` 경로에서 인증 없이 견적서 상세 정보가 표시됨
- [ ] 공유 페이지에서 PDF 다운로드가 정상 동작함
- [ ] 존재하지 않는 ID 접근 시 적절한 에러 페이지가 표시됨
- [ ] Open Graph 메타데이터가 올바르게 설정됨
- [ ] Playwright MCP로 공유 페이지 E2E 테스트 통과

##### PR 단위

- `feat/share-page`: 공유 전용 라우트, 레이아웃, 견적서 상세 페이지

---

#### Task 406: Phase 4 통합 테스트 및 QA

- **범위**: Phase 4 전체 기능에 대한 Playwright MCP E2E 테스트 및 품질 검증
- **예상 기간**: 2~3일
- **의존성**: Task 401~405 전체 완료

##### 구현 사항

- Playwright MCP 전체 사용자 시나리오 E2E 테스트
  - 시나리오 A: 관리자 여정 - 로그인 > 관리자 대시보드 > 견적서 목록 > 링크 복사
  - 시나리오 B: 클라이언트 공유 여정 - 공유 링크 접근 > 견적서 조회 > PDF 다운로드
  - 시나리오 C: 다크모드 전환 - 테마 토글 > 모든 페이지 다크모드 검증
- 반응형 UI 검증
  - 관리자 레이아웃: 모바일(375px) / 태블릿(768px) / 데스크탑(1280px)
  - 공유 페이지: 모바일 / 데스크탑
  - 사이드바 Sheet 동작 검증
- 에러 시나리오 테스트
  - 존재하지 않는 견적서 공유 링크 접근
  - Notion API 오류 시 공유 페이지 에러 처리
  - 클립보드 API 미지원 환경 폴백 동작
- 정적 검증
  - `npm run check-all` 통과
  - `npm run build` 성공
  - TypeScript 타입 에러 없음

##### E2E 테스트 시나리오 (Playwright MCP)

**시나리오 A: 관리자 견적서 관리 여정**

```typescript
// 1. 관리자 대시보드 접근
// mcp__playwright__browser_navigate: http://localhost:3000/admin/invoices
// mcp__playwright__browser_snapshot: 관리자 레이아웃 + 견적서 목록 표시 확인

// 2. 견적서 검색
// mcp__playwright__browser_fill_form: 검색어 입력
// mcp__playwright__browser_wait_for: 필터링 결과 로드
// mcp__playwright__browser_snapshot: 검색 결과 표시 확인

// 3. 공유 링크 복사
// mcp__playwright__browser_click: 링크 복사 버튼
// mcp__playwright__browser_snapshot: 토스트 알림 표시 확인
```

**시나리오 B: 공유 링크 접근 여정**

```typescript
// 1. 공유 링크로 직접 접근 (비인증)
// mcp__playwright__browser_navigate: http://localhost:3000/share/invoices/[id]
// mcp__playwright__browser_snapshot: 견적서 상세 정보 표시 확인

// 2. PDF 다운로드
// mcp__playwright__browser_click: PDF 다운로드 버튼
// mcp__playwright__browser_snapshot: 다운로드 트리거 확인
```

**시나리오 C: 다크모드 전환 검증**

```typescript
// 1. 라이트 모드 스크린샷
// mcp__playwright__browser_navigate: http://localhost:3000/admin/invoices
// mcp__playwright__browser_take_screenshot: 라이트 모드

// 2. 다크모드 전환
// mcp__playwright__browser_click: 테마 토글 버튼
// mcp__playwright__browser_take_screenshot: 다크 모드

// 3. 공유 페이지 다크모드
// mcp__playwright__browser_navigate: http://localhost:3000/share/invoices/[id]
// mcp__playwright__browser_take_screenshot: 공유 페이지 다크모드
```

##### 완료 기준

- [ ] 시나리오 A (관리자 여정) - Playwright MCP 테스트 통과
- [ ] 시나리오 B (공유 링크 여정) - Playwright MCP 테스트 통과
- [ ] 시나리오 C (다크모드) - 모든 페이지 다크모드 스크린샷 정상
- [ ] 반응형 UI - 375px/768px/1280px 레이아웃 정상
- [ ] `npm run check-all` 통과
- [ ] `npm run build` 에러 없이 성공

##### PR 단위

- `test/phase4-e2e`: Phase 4 전체 E2E 테스트 결과 문서화

---

## 의존성 및 우선순위 맵

```
Phase 0~3 (MVP 완료)
    ↓
Phase 4 (고도화)
    ├── Task 401 (다크모드) ──────────────────┐
    ├── Task 402 (관리자 레이아웃) ────┐      │
    │                                  ↓      │
    │                    Task 403 (관리자 목록)│
    │                                  ↓      │
    │                    Task 404 (공유 링크)  │
    │                                  ↓      │
    │                    Task 405 (공유 페이지)│
    │                                         │
    └── Task 406 (통합 테스트) ←──────────────┘
```

### Task별 병렬 개발 가능 여부

| Task | 병렬 가능 | 선행 의존성 | 이유                           |
| ---- | --------- | ----------- | ------------------------------ |
| 401  | 가능      | 없음        | 독립적인 테마 시스템           |
| 402  | 가능      | 없음        | 독립적인 레이아웃 구조         |
| 403  | 불가      | 402         | 관리자 레이아웃 필요           |
| 404  | 불가      | 403         | 관리자 견적서 목록에 버튼 통합 |
| 405  | 불가      | 404         | 공유 URL 스키마 의존           |
| 406  | 불가      | 401~405     | 전체 기능 통합 테스트          |

---

## Git Workflow

### 브랜치 전략

```
main
  └── feat/dark-mode              # Task 401
  └── feat/admin-layout           # Task 402
  └── feat/admin-invoices         # Task 403
  └── feat/share-link             # Task 404
  └── feat/share-page             # Task 405
  └── test/phase4-e2e             # Task 406
```

### 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
chore: 빌드 설정, 의존성 업데이트
refactor: 기능 변경 없는 코드 개선
docs: 문서 수정
style: 코드 포맷팅
test: 테스트 추가/수정
```

### PR 머지 기준

- [ ] `npm run check-all` 통과
- [ ] `npm run build` 성공
- [ ] API 연동 또는 비즈니스 로직 구현 시 Playwright MCP E2E 테스트 필수 완료
- [ ] 코드 리뷰 승인

---

## 위험 요소 및 대응 방안

| 위험 요소                        | 가능성 | 영향도 | 대응 방안                                                       |
| -------------------------------- | ------ | ------ | --------------------------------------------------------------- |
| 다크모드 shadcn/ui 컴포넌트 호환 | 낮음   | 중간   | shadcn/ui는 기본 다크모드 지원, CSS 변수 기반 커스텀            |
| 공유 링크 보안 (무단 접근)       | 중간   | 높음   | 견적서 ID가 UUID이므로 추측 어려움, 필요 시 토큰 기반 인증 추가 |
| 클립보드 API 브라우저 호환성     | 낮음   | 낮음   | Clipboard API 미지원 시 execCommand 폴백 구현                   |
| 관리자/클라이언트 라우팅 충돌    | 낮음   | 중간   | App Router 라우트 그룹으로 명확히 분리                          |
| PDF 다운로드 다크모드 간섭       | 중간   | 중간   | PDF 템플릿에 명시적으로 라이트 모드 스타일 강제 적용            |

---

## Post-Phase 4 백로그

다음 기능들은 Phase 4 이후 검토합니다.

| 기능                | 설명                                          | 예상 복잡도 |
| ------------------- | --------------------------------------------- | ----------- |
| Supabase 인증 연동  | UI 완성된 인증을 실제 Supabase로 연결         | 중간        |
| 역할 기반 접근 제어 | 영업팀/클라이언트 역할별 데이터 필터링        | 중간        |
| 이메일 발송         | 견적서 공유 링크를 클라이언트에게 이메일 발송 | 중간        |
| 견적서 편집         | 웹에서 견적서 내용 수정 (현재는 Notion에서만) | 높음        |
| 알림 기능           | 견적서 만료 임박 이메일/웹 알림               | 중간        |
| 고급 리포트         | 월별/고객별 견적서 통계 대시보드              | 높음        |
| 프로필 관리         | 사용자 이름, 비밀번호 변경 페이지             | 낮음        |
