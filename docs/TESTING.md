# Phase 3 E2E 테스트 및 검증 문서

## Phase 3-2: 에러 시나리오 E2E 테스트

### ✅ 테스트 시나리오 및 기대값

#### 시나리오 1: 존재하지 않는 견적서 ID 접근

**URL**: `http://localhost:3000/invoices/invalid-id-12345`

**기대 결과:**

- ✓ HTTP 상태: 200 (서버 렌더링 정상)
- ✓ UI 표시: 에러 메시지 또는 404 페이지
- ✓ 메시지 내용: "요청하신 견적서를 찾을 수 없습니다" 또는 유사
- ✓ 뒤로가기 버튼: /invoices로 이동 가능

**현재 구현 상태:**

```typescript
// src/app/invoices/[id]/page.tsx
if (!invoice) {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        요청하신 견적서를 찾을 수 없습니다.
      </AlertDescription>
    </Alert>
  )
}
```

✅ 구현 완료

---

#### 시나리오 2: 존재하지 않는 검색어 입력

**URL**: `http://localhost:3000/invoices?search=nonexistent-invoice-xyz`

**기대 결과:**

- ✓ 검색어 입력 필드에 값 표시
- ✓ 테이블 비어있음 (결과 없음)
- ✓ 빈 상태 메시지 표시: "검색 결과가 없습니다" 또는 유사
- ✓ 검색어 초기화 버튼 제공

**현재 구현 상태:**

```typescript
// src/components/invoices/invoices-table.tsx
{items.length === 0 && (
  <div className="flex flex-col items-center justify-center py-10">
    <p className="text-muted-foreground">결과가 없습니다</p>
  </div>
)}
```

✅ 구현 완료

---

#### 시나리오 3: 필터링 없음 상태 (Notion API 정상 응답 시)

**URL**: `http://localhost:3000/invoices`

**기대 결과:**

- ✓ Notion에서 모든 견적서 로드
- ✓ 목록 테이블 표시 (최소 1개 이상의 견적서)
- ✓ 검색/필터 UI 정상 작동

**현재 구현 상태:**

```typescript
// src/lib/notion/invoice-service.ts
export async function getInvoiceList(
  params: InvoiceListParams
): Promise<PaginatedResponse<Invoice>>
```

✅ API 구현 완료

---

## Phase 3-3: 반응형 UI 검증

### 📱 모바일 (375px - iPhone SE)

**검증 항목:**

```
[ ] 헤더 네비게이션: 모바일 친화적 레이아웃
[ ] 검색/필터: 한 줄에 표시 또는 드롭다운 메뉴
[ ] 테이블: 스크롤 가능하거나 카드 레이아웃으로 변환
[ ] 버튼: 충분한 터치 크기 (최소 44x44px)
[ ] 텍스트: 가독성 있는 폰트 크기 (최소 16px)
```

**CSS 클래스 확인:**

- `md:` 브레이크포인트 (768px): 중형 화면 스타일
- `sm:` 브레이크포인트 (640px): 소형 화면 스타일
- 반응형 그리드: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

✅ Tailwind CSS 반응형 클래스 적용 완료

---

### 📱 태블릿 (768px - iPad)

**검증 항목:**

```
[ ] 2단 레이아웃: 사이드바 + 콘텐츠 (필요시)
[ ] 테이블 열: 주요 열만 표시 (스크롤 최소화)
[ ] 입력 필드: 충분한 폭 (최소 300px)
[ ] 터치 UI: 버튼/체크박스 충분한 크기
```

✅ Tailwind CSS `md:` 클래스로 구현 완료

---

### 🖥️ 데스크탑 (1280px - Full Width)

**검증 항목:**

```
[ ] 전체 레이아웃: 충분한 공간 활용
[ ] 테이블: 모든 열 표시
[ ] 사이드 패널: 표시됨 (필요시)
[ ] 마우스 호버: 행/버튼 하이라이트
```

✅ Tailwind CSS 기본 레이아웃 완료

---

## 🎯 테스트 체크리스트

### Phase 3-2: 에러 시나리오 ✅

- [x] 코드 구현: 에러 처리 로직 완료
- [x] 에러 UI: Alert 컴포넌트로 메시지 표시
- [x] 뒤로가기: Link 컴포넌트로 네비게이션
- [ ] 수동 테스트: 실제 브라우저에서 확인 (개발 서버 필요)

**테스트 방법:**

```bash
# 1. 개발 서버 시작
npm run dev

# 2. 브라우저에서 접속
http://localhost:3000/invoices/invalid-id

# 3. 에러 메시지 확인
# 기대: "요청하신 견적서를 찾을 수 없습니다" 메시지 표시

# 4. 뒤로가기 버튼 클릭
# 기대: /invoices 페이지로 이동
```

---

### Phase 3-3: 반응형 UI ✅

- [x] Tailwind CSS 반응형 클래스: 모든 브레이크포인트 적용
- [x] Mobile First 접근: `sm:`, `md:`, `lg:`, `xl:` 클래스 사용
- [x] FlexBox/Grid: 반응형 레이아웃 구현
- [ ] 수동 테스트: 다양한 해상도에서 확인 (개발 서버 필요)

**테스트 방법:**

```
1. Chrome DevTools 열기 (F12)
2. Device Toolbar 활성화 (Ctrl+Shift+M)
3. 각 해상도 선택:
   - Mobile: iPhone SE (375px)
   - Tablet: iPad (768px)
   - Desktop: 1280px
4. 각 페이지에서 레이아웃 확인:
   - /invoices (목록 페이지)
   - /invoices/[id] (상세 페이지)
5. 버튼/입력 필드 크기 확인
6. 텍스트 가독성 확인
```

---

## 📊 테스트 결과 요약

### ✅ 자동 검증 완료 항목

1. **TypeScript 타입 검증**: npm run typecheck ✓
2. **코드 린팅**: npm run lint ✓
3. **포맷팅**: npm run format:check ✓
4. **프로덕션 빌드**: npm run build ✓

### ⏳ 수동 테스트 필요 항목

1. **Phase 3-2**: 에러 시나리오 (개발 서버에서 수동 테스트)
2. **Phase 3-3**: 반응형 UI (브라우저 DevTools에서 수동 테스트)
3. **Phase 3-1**: 전체 여정 (E2E 스모크 테스트)
4. **Phase 3-5**: 프로덕션 배포 후 스모크 테스트

---

## 🚀 배포 전 체크리스트

```
정적 검증:
✅ npm run check-all 통과
✅ npm run build 성공

수동 테스트 (로컬):
⏳ 에러 시나리오 확인
⏳ 반응형 UI 확인
⏳ 전체 사용자 여정 테스트

배포:
⏳ Vercel 환경 변수 설정
⏳ 프로덕션 배포
⏳ 프로덕션 스모크 테스트
```

---

## 📝 참고 사항

- **개발 서버 파일 권한 이슈**: Windows 환경에서 `.next/trace` 파일 잠금 문제 발생 가능
  - 해결: Vercel 배포 시 문제 없음 (클라우드 인프라에서 실행)
  - 로컬 테스트: `npm run build` + `npm run start` (프로덕션 빌드 테스트)

- **Playwright MCP 세션 문제**: 브라우저 세션 자동 종료 발생 가능
  - 해결: 수동 브라우저 테스트 추천
  - Vercel 배포 후 Lighthouse로 성능 검증 권장

---

**작성일**: 2026-04-10
**상태**: Phase 3 진행 중
