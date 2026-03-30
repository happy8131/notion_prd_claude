# 메타 프롬프트: MVP 견적서 웹 애플리케이션 PRD 생성

## 📋 프롬프트 목적

이 메타 프롬프트는 Claude를 사용하여 **노션 기반 견적서 관리 시스템**의 MVP(최소 실행 가능 제품) PRD(제품 요구사항 문서)를 자동으로 생성합니다. 생성된 PRD는 실제 개발 시작 전 요구사항을 명확히 하고, 팀 간 커뮤니케이션을 효율화합니다.

---

## 🎯 시스템 역할 설정

```
당신은 경험 많은 제품 관리자(PM)이자 기술 리더입니다.
당신의 역할:
- 비즈니스 요구사항을 기술적 실현 가능한 MVP로 변환
- 핵심 기능과 Nice-to-have 기능을 구분
- 명확하고 측정 가능한 성공 지표 정의
- Next.js 15.5.3 + React 19 기술 스택에 맞는 아키텍처 제안
```

---

## 📥 입력 정보 (사용자가 제공)

프롬프트 실행 시 다음 정보를 Claude에게 제공하세요:

### 1. 프로젝트 개요

```
- 프로젝트명: [예: 클라이언트명_견적서시스템]
- 주요 사용자: [예: 영업팀, 클라이언트]
- 핵심 목표: [예: 신청부터 PDF 다운로드까지 웹에서 완료]
```

### 2. Notion 연동 정보

```
- Notion Database 구조
  - 필드명: [예: 견적서ID, 고객명, 상품목록, 금액, 작성일자]
  - 현재 데이터 포맷
  - 데이터 연동 방식 (API/CSV/외부 도구)
```

### 3. 주요 요구사항

```
- 웹 페이지 기능:
  - 견적서 조회 (검색/필터링 필요여부)
  - 견적서 상세 보기
  - 고객 정보 확인

- PDF 다운로드 기능:
  - 다운로드 형식 (레이아웃, 로고, 워터마크 등)
  - 브라우저 인쇄 vs 서버 생성 PDF

- 추가 요구사항:
  - 승인/거절 기능
  - 이메일 발송
  - 버전 관리
```

### 4. 기술 제약사항

```
- Notion API 사용 가능 여부
- 외부 라이브러리 사용 제한
- 성능 요구사항 (로딩 시간, 동시 사용자 수)
- 보안 요구사항
```

---

## 📤 출력 형식 (생성될 PRD 구조)

생성되는 PRD는 다음 구조를 따릅니다:

### 1. Executive Summary (경영진 요약)

```markdown
### 📊 Executive Summary

**프로젝트명**: [프로젝트명]
**목표 고객**: [대상 사용자]
**핵심 가치**: [주요 이점]
**예상 개발 기간**: [추정 일정]
**우선순위**: [High/Medium/Low]
```

### 2. Problem Statement (문제 정의)

```markdown
### 🔴 Problem Statement

**현재 상황**:

- [현재의 문제점 1]
- [현재의 문제점 2]

**비용 영향**:

- [시간 비용]
- [인력 비용]
- [실수로 인한 비용]
```

### 3. MVP Scope (MVP 범위)

```markdown
### 🎯 MVP Scope

#### 포함될 기능 (In Scope)

- [ ] Notion 데이터 조회 및 표시
- [ ] 견적서 웹 페이지 렌더링
- [ ] PDF 다운로드 기능
- [ ] 기본 필터링/검색
- [ ] 반응형 디자인

#### 제외될 기능 (Out of Scope - Phase 2+)

- [ ] 견적서 편집 기능
- [ ] 자동 이메일 발송
- [ ] 고급 분석 대시보드
- [ ] 다국어 지원
```

### 4. User Stories (사용자 스토리)

```markdown
### 👥 User Stories

#### Story 1: 견적서 목록 조회

**누가**: 영업팀, 클라이언트
**무엇을**: 모든 견적서 목록을 웹에서 조회하고 싶다
**왜**: 신청 상태를 빠르게 파악하기 위해

**인수 조건**:

- [ ] Notion 데이터가 실시간으로 표시됨
- [ ] 검색/필터링이 2초 이내에 응답
- [ ] 모바일에서도 잘 보임

---

#### Story 2: 견적서 상세 보기

**누가**: 클라이언트
**무엇을**: 견적서 상세 내용을 웹에서 확인하고 싶다
**왜**: 정확한 정보를 확인하고 PDF로 저장하기 위해

**인수 조건**:

- [ ] 모든 견적서 정보가 명확하게 표시됨
- [ ] 레이아웃이 전문적임
- [ ] 인쇄 미리보기 가능

---

#### Story 3: PDF 다운로드

**누가**: 클라이언트
**무엇을**: 견적서를 PDF로 다운로드하고 싶다
**왜**: 오프라인에서 확인하거나 전달하기 위해

**인수 조건**:

- [ ] PDF 다운로드 버튼이 명확함
- [ ] PDF가 30초 이내에 생성됨
- [ ] PDF 포맷이 일관됨
```

### 5. Technical Architecture (기술 아키텍처)

```markdown
### 🏗️ Technical Architecture

#### 기술 스택

- **Frontend**: Next.js 15.5.3, React 19, TypeScript
- **Styling**: TailwindCSS v4 + shadcn/ui
- **PDF 생성**: [html2pdf / puppeteer / jsPDF 등]
- **Notion API**: @notionhq/client
- **Forms**: React Hook Form + Zod (필요시)
- **Server Actions**: Next.js Server Actions

#### 데이터 흐름
```

Notion Database
↓ (API)
Next.js API Routes / Server Actions
↓
React Components (캐시)
↓
클라이언트 UI (조회/필터)
↓
PDF Generator (html2pdf/etc)
↓
브라우저 다운로드

```

#### 페이지 구조
```

/
├── /invoices # 견적서 목록 페이지
│ ├── 검색/필터링 컴포넌트
│ ├── 테이블 리스트
│ └── 페이지네이션
│
├── /invoices/[id] # 견적서 상세 페이지
│ ├── 견적서 정보 렌더링
│ ├── PDF 다운로드 버튼
│ └── 인쇄 기능
│
└── /api/invoices # API 엔드포인트
└── 파라미터: id, format(web/pdf)

```

#### 캐싱 전략
- Notion 데이터: ISR (Incremental Static Regeneration) - 5분 주기
- 클라이언트 필터링: SWR / React Query
```

### 6. Database Schema (데이터베이스 구조)

````markdown
### 📊 Database Schema

#### Notion Table: Invoices

| 필드명        | 타입     | 설명                               | 필수 |
| ------------- | -------- | ---------------------------------- | ---- |
| ID            | UUID     | 견적서 고유 ID                     | ✅   |
| InvoiceNumber | Text     | 견적서 번호                        | ✅   |
| ClientName    | Text     | 고객명                             | ✅   |
| ClientEmail   | Email    | 고객 이메일                        | ❌   |
| Amount        | Number   | 총 금액                            | ✅   |
| Currency      | Select   | 통화 (KRW/USD)                     | ✅   |
| Items         | Relation | 상품 목록                          | ✅   |
| CreatedDate   | Date     | 작성일                             | ✅   |
| ExpiryDate    | Date     | 유효기간                           | ❌   |
| Status        | Select   | 상태 (Draft/Sent/Accepted/Expired) | ✅   |
| Notes         | Text     | 특이사항                           | ❌   |

#### Next.js 타입 정의

```typescript
// app/types/invoice.ts
interface InvoiceItem {
  name: string
  quantity: number
  unitPrice: number
  amount: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail?: string
  amount: number
  currency: 'KRW' | 'USD'
  items: InvoiceItem[]
  createdDate: string
  expiryDate?: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired'
  notes?: string
}
```
````

````

### 7. Feature Specifications (기능 명세)
```markdown
### ⚙️ Feature Specifications

#### Feature 1: 견적서 목록 조회
**기능명**: Invoice List Page
**경로**: GET /invoices
**입력**:
- searchTerm (optional): 고객명/견적서번호
- status (optional): 상태 필터
- page (optional): 페이지 번호

**출력**:
```json
{
  "invoices": [
    {
      "id": "...",
      "invoiceNumber": "INV-2026-001",
      "clientName": "ABC Corp",
      "amount": 1000000,
      "status": "Sent",
      "createdDate": "2026-03-30"
    }
  ],
  "total": 50,
  "page": 1,
  "pageSize": 10
}
````

**성능 요구사항**:

- 로딩 시간: 2초 이내
- 검색 응답 시간: 500ms 이내

---

#### Feature 2: 견적서 상세 보기

**기능명**: Invoice Detail Page
**경로**: GET /invoices/[id]
**입력**: invoiceId
**출력**: Invoice 객체 (위 Schema 참조)

**UI 컴포넌트**:

- 헤더 (회사로고, 제목)
- 고객 정보 섹션
- 상품 테이블
- 합계/세금/총액
- PDF 다운로드 버튼
- 인쇄 버튼

---

#### Feature 3: PDF 다운로드

**기능명**: Generate Invoice PDF
**경로**: GET /api/invoices/[id]/pdf
**입력**: invoiceId, format (web/pdf)
**출력**: PDF 파일 또는 HTML

**기술 사양**:

- 라이브러리: [html2pdf / jsPDF + html2canvas / puppeteer]
- 용량: 최대 5MB
- 생성 시간: 30초 이내
- 파일명: `Invoice_[InvoiceNumber]_[Date].pdf`

**PDF 포맷**:

- A4 용지 사이즈
- 마진: 20mm
- 폰트: 한글 지원 (Noto Sans KR)
- 해상도: 300 DPI (인쇄용)

````

### 8. Success Metrics (성공 지표)
```markdown
### 📈 Success Metrics

#### 기술 지표
- ✅ 페이지 로딩 시간: < 2초 (LCP)
- ✅ PDF 생성 시간: < 30초
- ✅ 모바일 반응형 점수: > 85 (Lighthouse)
- ✅ 접근성 점수: > 90 (WCAG 2.1)

#### 사용자 지표
- ✅ 견적서 조회 성공률: 99%
- ✅ PDF 다운로드 성공률: 98%
- ✅ 사용자 만족도: > 4/5

#### 비즈니스 지표
- ✅ 개발 기간: [X주]
- ✅ 개발 인력: [X명]
- ✅ 유지보수 비용: [월 X만원]
````

### 9. Timeline & Milestones (일정 & 마일스톤)

```markdown
### 📅 Timeline & Milestones

#### Phase 1: 개발 (Week 1-2)

- [ ] Notion API 연동 설정
- [ ] 목록 페이지 개발
- [ ] 상세 페이지 개발
- [ ] PDF 생성 기능 개발

#### Phase 2: 테스트 (Week 3)

- [ ] 기능 테스트
- [ ] 브라우저 호환성 테스트
- [ ] 성능 최적화
- [ ] 보안 검토

#### Phase 3: 배포 (Week 4)

- [ ] 스테이징 배포
- [ ] UAT (사용자 수용 테스트)
- [ ] 프로덕션 배포
- [ ] 모니터링 설정

#### Deliverables

- [ ] 소스 코드 (GitHub)
- [ ] 배포 문서
- [ ] 운영 가이드
- [ ] API 문서
```

### 10. Dependencies & Risks (의존성 & 위험)

```markdown
### ⚠️ Dependencies & Risks

#### 의존성

- Notion API 안정성
- 외부 PDF 라이브러리의 한글 지원
- 클라이언트로부터의 데이터 스펙 확정

#### 위험 요소

| 위험             | 영향 | 확률 | 대응책                   |
| ---------------- | ---- | ---- | ------------------------ |
| Notion API 장애  | 높음 | 낮음 | API 응답 캐싱, 폴백 UI   |
| 한글 폰트 렌더링 | 중간 | 중간 | 웹폰트 사용, 로컬 테스트 |
| 동시성 문제      | 높음 | 낮음 | 서버 캐싱, 레이트 제한   |

#### 완화 전략

- [ ] Notion API 레이트 제한 대비 캐싱 전략
- [ ] 폰트 로딩 실패 시 폴백 폰트
- [ ] 에러 로깅 및 모니터링
```

### 11. Development Guidelines (개발 가이드)

```markdown
### 🛠️ Development Guidelines

#### 코딩 규칙

- 언어: 한국어 (주석, 커밋 메시지, 문서)
- 들여쓰기: 2칸
- 타입스크립트: 필수
- 폴더 구조: `app/` 내 App Router 사용

#### 컴포넌트 구조
```

app/
├── invoices/
│ ├── page.tsx # 목록 페이지
│ ├── [id]/
│ │ └── page.tsx # 상세 페이지
│ └── components/
│ ├── InvoiceList.tsx
│ ├── InvoiceDetail.tsx
│ └── PDFDownloadButton.tsx
│
├── api/
│ └── invoices/
│ ├── route.ts # 목록 API
│ └── [id]/
│ ├── route.ts # 상세 API
│ └── pdf/route.ts # PDF 생성 API
│
├── lib/
│ ├── notion.ts # Notion API 클라이언트
│ ├── pdf-generator.ts # PDF 생성 유틸
│ └── types.ts # 타입 정의
│
└── types/
└── invoice.ts # Invoice 인터페이스

```

#### 필수 라이브러리
- `@notionhq/client`: Notion API
- `html2pdf.js` 또는 `jspdf + html2canvas`: PDF 생성
- `react-hook-form`: 폼 처리 (필요시)
- `zod`: 스키마 검증

#### 테스트 요구사항
- 단위 테스트: 핵심 유틸 함수
- E2E 테스트: 주요 사용자 흐름
- 성능 테스트: PDF 생성, API 응답
```

### 12. 사후 검토 & 피드백

```markdown
### 📋 Post-Launch Review

#### 4주 후 평가 항목

- [ ] 사용자 피드백 수집
- [ ] 에러 로그 분석
- [ ] 성능 메트릭 검토
- [ ] 보안 취약점 점검

#### 개선 계획 (Phase 2)

- [ ] 사용자 피드백 반영 사항
- [ ] 성능 최적화 항목
- [ ] 새로운 기능 요청 (우선순위)
```

---

## 🚀 사용 방법

### Step 1: 프롬프트 실행

```bash
# Claude Code에서 다음과 같이 실행:
/claude PRD_PROMPT.md 활용해서 견적서 웹 애플리케이션 MVP PRD를 작성해줘.

# 그리고 다음 정보를 제공:
- 프로젝트명: [프로젝트명]
- Notion 데이터 구조: [필드 정보]
- 핵심 요구사항: [요청사항]
- 기술 제약사항: [제약조건]
```

### Step 2: PRD 문서 생성

Claude가 위의 **출력 형식**에 맞춰 PRD를 생성합니다.

### Step 3: PRD 저장 & 검토

```bash
# 생성된 내용을 다음 파일로 저장:
docs/PRD.md

# 팀 내 검토
- PM: 요구사항 적절성 검토
- 개발 리더: 기술 아키텍처 검토
- 디자인: UI/UX 요구사항 검토
```

### Step 4: 개발 착수

```bash
# PRD 확정 후 개발 시작:
npm run dev

# 개발 가이드 참조:
@/docs/guides/nextjs-15.md
@/docs/guides/component-patterns.md
```

---

## 📝 주의사항

⚠️ **꼭 확인하세요**:

1. **Notion API 키 보안**
   - `.env.local`에만 저장
   - GitHub에 노출 금지
   - 배포 환경에서는 환경 변수 사용

2. **데이터 프라이버시**
   - 클라이언트 정보 암호화 고려
   - GDPR/개인정보보호 정책 확인
   - PDF 다운로드 로그 기록

3. **PDF 생성 성능**
   - 대량 PDF 요청 시 큐 시스템 고려
   - 서버 메모리 사용량 모니터링
   - 클라이언트 사이드 생성 vs 서버 사이드 생성 비교

4. **브라우저 호환성**
   - 최신 브라우저 기준 (Chrome, Firefox, Safari, Edge)
   - IE 11 지원 불필요 (Next.js 15.5.3)

---

## 🔗 참고 자료

- [Notion API Docs](https://developers.notion.com/)
- [Next.js 15.5.3 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TailwindCSS v4](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [jsPDF Docs](https://github.com/parallax/jsPDF)
- [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)

---

**버전**: 1.0
**작성일**: 2026-03-30
**최종 수정**: 2026-03-30
