# 견적서 관리 시스템

Notion 데이터베이스 기반 견적서 웹 애플리케이션 MVP입니다.

## 기술 스택

- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Runtime**: React 19.1.0 + TypeScript 5
- **Styling**: TailwindCSS v4 + shadcn/ui (new-york style)
- **Auth & DB**: Supabase Auth + PostgreSQL
- **External API**: Notion API
- **Forms**: React Hook Form + Zod + Server Actions
- **PDF**: jsPDF + html2canvas

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 실제 값을 입력하세요:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 익명 키
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase 서비스 역할 키
- `NOTION_API_KEY` - Notion 인테그레이션 토큰
- `NOTION_INVOICE_DATABASE_ID` - Notion 견적서 데이터베이스 ID

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 으로 접속하세요.

## 주요 명령어

```bash
npm run dev         # 개발 서버 실행 (Turbopack)
npm run build       # 프로덕션 빌드
npm run check-all   # 타입 검사 + ESLint + Prettier 검사 통합 실행
npm run lint        # ESLint 검사
npm run format      # Prettier 포맷팅 적용
npm run typecheck   # TypeScript 타입 검사
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── login/              # 로그인 페이지 (F010)
│   ├── signup/             # 회원가입 페이지 (F010)
│   ├── invoices/           # 견적서 목록 페이지 (F001-F003, F011-F012)
│   │   └── [id]/           # 견적서 상세 페이지 (F001, F004-F005, F011-F012)
│   ├── globals.css         # 전역 스타일 (TailwindCSS v4 + shadcn 테마)
│   └── layout.tsx          # 루트 레이아웃
├── components/
│   ├── auth/               # 인증 관련 컴포넌트
│   │   ├── login-form.tsx  # 로그인 폼 (RHF + Zod)
│   │   └── signup-form.tsx # 회원가입 폼 (RHF + Zod)
│   ├── providers/          # Context Providers
│   └── ui/                 # shadcn/ui 컴포넌트
├── lib/
│   ├── supabase/           # Supabase 클라이언트
│   │   ├── client.ts       # 브라우저용 클라이언트
│   │   └── server.ts       # 서버용 클라이언트
│   ├── notion/             # Notion API 클라이언트
│   │   └── client.ts
│   ├── validations/        # Zod 스키마
│   │   ├── auth.ts         # 인증 폼 스키마
│   │   └── invoice.ts      # 견적서 필터 스키마
│   ├── env.ts              # 환경 변수 검증
│   └── utils.ts            # 유틸리티 함수
├── types/
│   └── index.ts            # 공통 TypeScript 타입
└── middleware.ts            # Supabase 인증 미들웨어
```

## 개발 가이드

상세 개발 가이드는 `docs/` 폴더를 참조하세요:

- `docs/PRD.md` - 프로젝트 요구사항
- `docs/guides/` - 기술별 개발 가이드
