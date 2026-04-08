---
description: '코드베이스를 자동 분석하여 완료된 작업을 ROADMAP.md에 체크합니다'
allowed-tools:
  [
    'Read(docs/ROADMAP.md:*)',
    'Read(src/**:*)',
    'Edit(docs/ROADMAP.md:*)',
    'Glob(src/**)',
    'Grep(src/**)',
  ]
---

# Claude 명령어: Update Roadmap (개선 버전)

코드베이스를 자동으로 분석하여 완료된 작업을 탐지하고, ROADMAP.md의 완료 기준 체크박스를 업데이트합니다.

## 사용법

```
/update-roadmap
```

## 개선 사항

현재 버전은 **코드베이스 자동 분석 기능**을 추가했습니다:

- ✅ 이전: 사용자가 Task 번호를 수동으로 입력
- ✨ 개선: 코드베이스를 자동으로 분석하여 완료 여부 판단

## 작동 원리

### Phase 1: 자동 분석 (코드베이스 스캔)

```
1. 핵심 파일 존재 여부 확인
   - Glob으로 파일 존재 여부 체크
   - Read로 파일 내용 분석

2. 각 완료 기준별 판단

   ✅ "Notion DB 목록 표시"
      → invoice-service.ts에서 databases.query 호출 존재 여부
      → TODO/하드코딩 샘플 제거 여부

   ✅ "검색 기능"
      → invoice-filter-bar.tsx 파일 존재 + searchTerm/debounce 구현

   ✅ "페이지네이션"
      → invoice-pagination.tsx 파일 존재 + page 파라미터 처리

   ✅ "Skeleton UI"
      → invoice-list-skeleton.tsx 파일 존재

   ✅ "빈 상태 메시지"
      → empty-state.tsx 파일 존재

   ✅ "미들웨어 리다이렉트"
      → middleware.ts에 redirect('/login') 로직 존재

3. 분석 결과 출력
   - 각 완료 기준별 상태 표시
   - ✅ 완료 / ⚠️ 부분 완료 / ❌ 미완료
```

### Phase 2: 사용자 확인

```
분석 결과를 보여주고 사용자가 최종 확인:

"다음 항목을 완료로 체크하시겠습니까?
- [x] 번호/고객명 검색 가능
- [x] 페이지네이션 (페이지당 20건)
- [x] 로딩 중 Skeleton UI 표시
...
(y/n)?"
```

### Phase 3: ROADMAP.md 업데이트

```
사용자 동의 시:

1. 완료된 체크박스 업데이트
   - [ ] 번호/고객명 검색 가능
   → [x] 번호/고객명 검색 가능

2. 날짜 자동 업데이트
   **📅 최종 업데이트**: YYYY-MM-DD

3. Phase 상태 업데이트
   Phase 1이 모두 완료되면:
   ### Phase 1: Notion 연동 및 견적서 목록 구현 ✅

4. 변경 사항 요약 출력
```

## 파일 매핑 규칙 (자동 분석 기준)

| 완료 기준           | 확인할 파일                                         | 조건                                    |
| ------------------- | --------------------------------------------------- | --------------------------------------- |
| Notion DB 목록 표시 | `src/lib/notion/invoice-service.ts`                 | `databases.query` 호출 + TODO/샘플 제거 |
| 검색 기능           | `src/components/invoices/invoice-filter-bar.tsx`    | `searchTerm` + `debounce` 구현          |
| 필터링 (상태)       | `src/components/invoices/invoice-filter-bar.tsx`    | `status` select 구현                    |
| 필터링 (날짜/통화)  | `src/components/invoices/invoice-filter-bar.tsx`    | `dateRange` + `currency` 구현           |
| 페이지네이션        | `src/components/invoices/invoice-pagination.tsx`    | `page` 파라미터 처리                    |
| Skeleton UI         | `src/components/invoices/invoice-list-skeleton.tsx` | 파일 존재                               |
| 에러 처리           | `src/components/invoices/`                          | Error Boundary 또는 `error.tsx` 존재    |
| 빈 상태             | `src/components/invoices/empty-state.tsx`           | 파일 존재                               |
| 미들웨어 리다이렉트 | `src/middleware.ts`                                 | `redirect('/login')` 로직 존재          |

## 프로세스

1. **ROADMAP.md 읽기** - 현재 체크 상태 파악
2. **코드베이스 자동 분석** - 핵심 파일 스캔 및 완료 여부 판단
3. **분석 결과 출력** - 각 완료 기준별 상태 표시
4. **사용자 확인** - "다음 항목들을 체크할까요?" 질문
5. **ROADMAP.md 업데이트** - `- [ ]` → `- [x]` 변환
6. **메타데이터 갱신** - 날짜, Phase 상태 업데이트
7. **변경 사항 요약** - 어떤 항목이 체크되었는지 출력

## 업데이트 규칙

### 체크박스 패턴

```
Before: - [ ] 견적서 번호 또는 고객명으로 검색 가능
After:  - [x] 견적서 번호 또는 고객명으로 검색 가능
```

### Phase 완료 표시

```
Before: ### Phase 1: Notion 연동 및 견적서 목록 구현 (F001, F002, F003)
After:  ### Phase 1: Notion 연동 및 견적서 목록 구현 (F001, F002, F003) ✅
```

### 날짜 업데이트

```
**📅 최종 업데이트**: 2026-04-08
```

## 주의사항

- 자동 분석 결과는 코드 존재 여부 기반입니다
- 사용자가 최종 확인해야 실제 업데이트가 진행됩니다
- 이미 `[x]` 표시된 항목은 건너뜁니다
- 날짜는 자동으로 오늘 날짜(YYYY-MM-DD)로 설정됩니다

## 사용 예시

```bash
# 커맨드 실행
/update-roadmap

# Phase 1 자동 분석 결과:
📊 Phase 1: Notion 연동 및 견적서 목록 구현

✅ 견적서 번호 또는 고객명으로 검색 가능 (invoice-filter-bar.tsx 확인)
✅ 페이지네이션 동작 (페이지당 20건) (invoice-pagination.tsx 확인)
✅ 데이터 로딩 중 Skeleton UI 표시 (invoice-list-skeleton.tsx 확인)
⚠️  상태, 날짜 범위, 통화로 필터링 가능 (상태만 구현, 날짜/통화 UI 없음)
❌ /invoices 페이지에서 Notion DB 목록 표시 (invoice-service.ts에서 샘플 데이터 반환)
✅ 검색 결과 없을 시 빈 상태 메시지 표시 (empty-state.tsx 확인)
⚠️  API 오류 시 에러 메시지 표시 (API 레벨만, UI Error Boundary 없음)

다음 항목들을 완료로 체크하시겠습니까? (y/n)
- 견적서 번호 또는 고객명으로 검색 가능
- 페이지네이션 동작 (페이지당 20건)
- 데이터 로딩 중 Skeleton UI 표시
- 검색 결과 없을 시 빈 상태 메시지 표시

> y

✅ ROADMAP.md 업데이트 완료!

변경 사항:
- [x] 견적서 번호 또는 고객명으로 검색 가능
- [x] 페이지네이션 동작 (페이지당 20건)
- [x] 데이터 로딩 중 Skeleton UI 표시
- [x] 검색 결과 없을 시 빈 상태 메시지 표시

📅 최종 업데이트: 2026-04-08
📊 현재 상태: Phase 1 부분 완료 (4/7 완료 기준)
```

## 고급 기능

### 1. 자동 Phase 진행 추적

- Phase 0: 환경 구성
- Phase 1: Notion 연동 (현재)
- Phase 2: 상세 조회 및 PDF (대기)
- Phase 3: QA 및 배포 (대기)

### 2. 완료율 계산

- Phase별 완료된 기준 / 전체 기준 개수
- 진행률 백분율 표시

### 3. 스마트 분석

- TODO 주석 감지
- 샘플 데이터 vs 실제 구현 구분
- 부분 완료 항목 식별
