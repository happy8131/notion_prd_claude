---
name: 프로젝트 컨텍스트
description: invoice-web 프로젝트의 Notion 연동 설계 결정사항 및 도메인 구조
type: project
---

## 프로젝트 목적

Notion Database를 백엔드 데이터 소스로 사용하는 견적서(Invoice) 관리 웹앱.
Next.js 15.5.3 + Server Actions + @notionhq/client 조합.

**Why:** 별도 DB 없이 Notion을 데이터 저장소로 활용하여 빠른 프로토타이핑 가능.
**How to apply:** API 함수 구현 시 Notion Client를 서버 사이드에서만 사용, 클라이언트에 노출 금지.

## 데이터베이스 설계 결정

- 상품 목록(InvoiceItem[]): JSON 직렬화 → rich_text 저장 (단순성 우선)
- 상태 필드: select 타입 (Draft/Sent/Accepted/Expired)
- 총 금액: number 타입 (format: "number")
- 통화: select 타입 (KRW/USD)

## 파일 구조

- `src/lib/notion/client.ts` — Notion 클라이언트 싱글톤
- `src/lib/notion/transforms.ts` — API 응답 → 도메인 타입 변환
- `src/lib/notion/invoice-api.ts` — CRUD 함수
- `src/lib/notion/retry.ts` — 재시도 유틸리티
- `src/lib/notion/error-handler.ts` — 에러 처리
- `src/lib/actions/invoice-actions.ts` — Server Actions
- `src/lib/types/invoice.ts` — TypeScript 타입 정의
- `docs/guides/notion-api-guide.md` — 개발 가이드 문서 (2026-03-30 작성)
