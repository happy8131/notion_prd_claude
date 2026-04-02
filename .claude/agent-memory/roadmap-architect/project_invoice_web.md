---
name: invoice-web 프로젝트 컨텍스트
description: 노션 기반 견적서 웹 애플리케이션 MVP의 아키텍처 결정 및 로드맵 구성 전략
type: project
---

노션 기반 견적서 웹 애플리케이션 MVP 프로젝트 (2026-04-02 로드맵 생성)

**Why:** Notion을 단일 데이터 소스로 활용하는 경량 견적서 포털. 영업팀은 Notion에서 데이터 입력, 클라이언트는 웹에서 조회/PDF 다운로드.

**How to apply:** 로드맵 업데이트나 기능 추가 시 Notion API 의존성과 역할(SALES/CLIENT) 기반 접근 제어를 항상 고려할 것.

## 핵심 아키텍처 결정

- 데이터 저장소 이중화: Notion API (견적서 원본 데이터) + Supabase PostgreSQL (사용자/역할 데이터)
- Supabase Auth + Next.js 미들웨어로 세션 관리 (SSR 방식)
- html2pdf.js 동적 import 방식으로 PDF 생성 (클라이언트 컴포넌트)
- 역할 기반 접근 제어: CLIENT는 `customer_name` 필드로 Notion 데이터 필터링

## 페이즈 분할 기준

- Phase 0: 외부 서비스 연결 검증 (선행 필수)
- Phase 1: 인증 완성 (보호된 라우트의 전제)
- Phase 2: Notion 연동 + 목록 (핵심 데이터 레이어)
- Phase 3: 상세 + PDF (클라이언트 핵심 가치)
- Phase 4: 접근 제어 + 유효성 표시 (보안 강화)
- Phase 5: QA + 배포

## 현재 구현 상태 (2026-04-02)

- 기반 구조 완료: 타입 정의, Supabase/Notion 클라이언트, 미들웨어, 폼 UI 컴포넌트
- 미완료: 서버 액션 연동, Notion 서비스 레이어, 모든 페이지 실제 구현

## 주요 위험 요소

- CLIENT `customer_name`과 Notion 고객명 불일치 가능성 → 정규화 필요
- Notion API Rate Limit → Next.js revalidate 캐싱 전략 필요
