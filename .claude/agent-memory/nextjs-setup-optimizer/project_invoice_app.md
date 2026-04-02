---
name: Invoice App 프로젝트 컨텍스트
description: 노션 기반 견적서 웹 애플리케이션 MVP - 초기화 및 스택 구성 기록
type: project
---

이 프로젝트는 Notion 데이터베이스에서 견적서 데이터를 읽어 클라이언트가 웹에서 확인하고 PDF로 다운로드할 수 있는 MVP 애플리케이션이다.

**Why:** 영업팀이 Notion에서 견적서를 작성하면 클라이언트가 별도 로그인 없이 링크로 확인하는 게 아니라 역할 기반 인증을 통해 자신의 견적서만 조회하도록 설계.

**How to apply:** 기능 추가 시 반드시 F001~F012 기능 ID와 연결해서 PRD 정합성 유지. 새 페이지나 API 추가 전 `docs/PRD.md` 참조.

## 초기화 시 제거된 스타터킷 보일러플레이트

- `src/components/sections/` (hero, features, cta) - 랜딩페이지 전용
- `src/components/navigation/` (main-nav, mobile-nav) - 스타터킷 네비게이션
- `src/components/layout/` (header, footer, container) - 랜딩페이지 레이아웃
- `src/components/theme-toggle.tsx` - 다크모드 토글 (견적서 앱 불필요)
- `public/*.svg` - Next.js 기본 SVG들 (file, globe, next, vercel, window)
- `docs/PRD_PROMPT.md` - GPT 생성용 프롬프트 파일

## 초기화 시 추가된 핵심 파일

- `src/middleware.ts` - Supabase 인증 미들웨어 (세션 갱신 + 라우트 보호)
- `src/lib/supabase/client.ts` - 브라우저용 Supabase 클라이언트
- `src/lib/supabase/server.ts` - 서버용 Supabase 클라이언트 (쿠키 기반 세션)
- `src/lib/notion/client.ts` - Notion API 클라이언트 싱글톤
- `src/lib/validations/auth.ts` - 로그인/회원가입 Zod 스키마
- `src/lib/validations/invoice.ts` - 견적서 필터 Zod 스키마
- `src/types/index.ts` - User, Invoice, InvoiceItem 등 공통 타입
- `src/components/auth/login-form.tsx` - RHF+Zod 기반 로그인 폼
- `src/components/auth/signup-form.tsx` - RHF+Zod 기반 회원가입 폼 (역할 선택 포함)
- `.env.example` - 환경 변수 예시 파일

## 설치된 추가 의존성

- `@supabase/supabase-js` - Supabase 클라이언트
- `@supabase/ssr` - Next.js SSR 환경 Supabase 어댑터
- `@notionhq/client` - Notion 공식 API 클라이언트
- `jspdf` + `html2canvas` - PDF 생성/다운로드
