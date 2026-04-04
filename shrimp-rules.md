# AI 개발 규칙 문서 (shrimp-rules.md)

## 프로젝트 개요

**프로젝트명**: invoice-web (견적서 웹 애플리케이션)

**기술 스택**:

- Runtime: Node.js (via Next.js)
- Framework: Next.js 15.5.3 (App Router + Turbopack)
- Language: TypeScript 5 (strict mode)
- UI Framework: React 19.1.0
- UI Components: shadcn/ui (new-york style)
- Styling: TailwindCSS v4
- Forms: React Hook Form + Zod
- Icons: Lucide Icons
- Database: Supabase
- External APIs: Notion API
- PDF Export: html2canvas + jsPDF
- Linting: ESLint + Prettier
- Git Hooks: Husky + lint-staged

---

## 프로젝트 아키텍처

### 디렉토리 구조

```
src/
├── app/                    # Next.js App Router (페이지 및 라우팅)
│   ├── (auth)/            # 인증 관련 라우트
│   ├── invoices/          # 견적서 관련 라우트
│   ├── layout.tsx         # 루트 레이아웃
│   └── middleware.ts      # 미들웨어
├── components/            # React 컴포넌트
│   ├── auth/             # 인증 폼 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트 (자동 생성)
│   └── providers/        # Context/Provider 컴포넌트
├── lib/                  # 유틸리티 및 헬퍼 함수
│   ├── supabase/        # Supabase 클라이언트/서버 설정
│   ├── notion/          # Notion API 클라이언트
│   ├── validations/     # Zod 스키마
│   ├── utils.ts         # 공통 유틸리티 (cn() 등)
│   └── env.ts           # 환경 변수 타입 정의
├── types/              # 글로벌 TypeScript 타입 정의
└── middleware.ts       # Next.js 미들웨어

docs/                   # 개발 문서
├── PRD.md             # 제품 요구사항
├── ROADMAP.md         # 개발 로드맵
└── guides/            # 개발 가이드
    ├── project-structure.md
    ├── component-patterns.md
    ├── styling-guide.md
    ├── forms-react-hook-form.md
    ├── nextjs-15.md
    └── notion-api-guide.md
```

---

## 코드 표준

### TypeScript 규칙

- **strict mode 필수**: `tsconfig.json`에 `"strict": true` 설정
- **경로 별칭 사용**: `@/*`를 `src/*`로 매핑하여 상대 경로 금지
  - ✅ `import { cn } from '@/lib/utils'`
  - ❌ `import { cn } from '../../../lib/utils'`
- **타입 정의 필수**: 모든 함수의 매개변수와 반환값에 타입 정의
  - ✅ `function getValue(key: string): string | null { ... }`
  - ❌ `function getValue(key) { ... }`
- **as any 금지**: 타입 강제 변환 대신 제너릭 또는 타입 가드 사용
- **null/undefined 명시**: Optional 타입은 `Type | null` 또는 `Type | undefined`로 표현

### 코딩 스타일

- **들여쓰기**: 2칸 스페이스 (모든 파일)
- **세미콜론**: ESLint 설정에 따름 (현재: 필수)
- **트레일링 쉼표**: ESLint Prettier 규칙에 따름
- **라인 길이**: 80-100자 권장, Prettier 자동 포매팅

### 명명 규칙

- **파일명**:
  - 컴포넌트: PascalCase (예: `InvoiceForm.tsx`)
  - 유틸리티/함수: camelCase (예: `formatDate.ts`)
  - 타입/인터페이스 파일: camelCase (예: `invoice.ts`)
- **변수/함수**: camelCase
  - ✅ `const maxRetries = 3`
  - ❌ `const MAX_RETRIES = 3` (상수도 camelCase)
- **컴포넌트 프롭**: camelCase
  - ✅ `<Button variant="primary" onClick={...} />`
  - ❌ `<Button variant="primary" on_click={...} />`
- **환경 변수**: UPPER_SNAKE_CASE (`.env` 파일)

### 주석과 문서화

- **모든 주석은 한국어로 작성**
- **함수 주석**: JSDoc 스타일 사용 (optional이지만 복잡한 함수에 권장)
  ```typescript
  /**
   * 청구서를 생성합니다.
   * @param data - 청구서 데이터
   * @returns 생성된 청구서 ID
   */
  ```
- **인라인 주석**: 왜(why)를 설명, 무엇(what)이 아님
  - ✅ `// 중복 제거를 위해 Set 사용`
  - ❌ `// Set 사용`

---

## 기능 구현 표준

### React 컴포넌트 패턴

- **함수형 컴포넌트 필수**: 클래스 컴포넌트 금지
- **Named export 사용**:
  ```typescript
  export function InvoiceForm() { ... }
  ```

  - ❌ `export default function ...`는 특수한 경우만
- **Props 타입 정의**:
  ```typescript
  interface InvoiceFormProps {
    invoiceId: string
    onSuccess?: (id: string) => void
  }
  export function InvoiceForm({ invoiceId, onSuccess }: InvoiceFormProps) { ... }
  ```
- **Props 분해(destructuring) 필수**: 함수 시그니처에서 명시
- **useCallback/useMemo 신중하게 사용**: 성능 병목이 확실한 경우만

### shadcn/ui 컴포넌트 규칙

- **shadcn/ui 컴포넌트만 사용**: 커스텀 UI는 shadcn/ui를 기반으로 확장
  - ✅ `import { Button } from '@/components/ui/button'`
  - ❌ 직접 HTML `<button>` 사용 금지
- **컴포넌트 추가 방법**:
  ```bash
  npx shadcn@latest add [component-name]
  # 예: npx shadcn@latest add button
  ```
- **컴포넌트 커스터마이징**: shadcn 파일을 직접 수정
  - 기본 shadcn 컴포넌트는 변경 금지 (라이브러리 업데이트 시 충돌)
  - 프로젝트별 커스텀은 `src/components/` 에서 새 컴포넌트 생성

### 폼 처리 규칙

- **React Hook Form + Zod 필수**: 다른 폼 라이브러리 금지
- **Zod 스키마 정의**:

  ```typescript
  // src/lib/validations/invoice.ts
  import { z } from 'zod'

  export const invoiceSchema = z.object({
    clientName: z.string().min(1, '고객 이름 필수'),
    amount: z.number().positive('금액은 양수여야 함'),
  })

  export type Invoice = z.infer<typeof invoiceSchema>
  ```

- **폼 컴포넌트 구조**:

  ```typescript
  'use client'

  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { invoiceSchema } from '@/lib/validations/invoice'

  export function InvoiceForm() {
    const form = useForm({
      resolver: zodResolver(invoiceSchema),
      defaultValues: { ... }
    })
    // ...
  }
  ```

- **Server Actions 활용**: 폼 제출은 Server Actions 권장

  ```typescript
  'use server'

  export async function createInvoice(data: Invoice) {
    // 서버에서 데이터 처리
  }
  ```

### 스타일링 규칙

- **TailwindCSS 클래스만 사용**: inline style 금지
  - ✅ `<div className="flex gap-4 p-2">`
  - ❌ `<div style={{ display: 'flex', gap: '4px' }}>`
- **cn() 유틸리티 사용**: 조건부 클래스 병합

  ```typescript
  import { cn } from '@/lib/utils'

  <button className={cn('px-4 py-2', isActive && 'bg-blue-500')} />
  ```

- **CSS-in-JS 라이브러리 금지**: styled-components, Emotion 등
- **Tailwind 커스텀 확장**: `tailwind.config.ts` 사용
  - ❌ `@apply` 남용 금지
  - ❌ 임의 값(arbitrary values) 과도 사용 금지

### Supabase 규칙

- **클라이언트/서버 클라이언트 분리**:

  ```typescript
  // src/lib/supabase/client.ts - 브라우저에서만 사용
  import { createBrowserClient } from '@supabase/ssr'

  // src/lib/supabase/server.ts - 서버에서만 사용
  import { createServerClient } from '@supabase/ssr'
  ```

- **환경 변수 사용**: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 등
- **타입 안전성**: Supabase 생성 타입 사용
  ```typescript
  import { Database } from '@/types/database'
  ```
- **Row Level Security(RLS) 정책 반드시 설정**: 데이터베이스 레벨 보안 필수

### Notion API 규칙

- **Notion 클라이언트 설정**: `src/lib/notion/client.ts`
- **타입 정의**: Notion API 응답에 타입 적용
- **에러 처리**: API 요청 실패 시 적절한 에러 처리
- **Rate Limiting**: Notion API 요청 제한 고려

---

## 외부 라이브러리 사용 규칙

### Lucide Icons

- **사용 방법**:

  ```typescript
  import { Plus, Trash2, Edit } from 'lucide-react'

  <Plus size={20} className="text-gray-500" />
  ```

- **아이콘 커스터마이징**: Tailwind 클래스로만 스타일링
- **SVG 직접 사용 금지**: 항상 lucide-react 아이콘 사용

### html2canvas + jsPDF

- **PDF 내보내기 용도로만 사용**
- **사용 패턴**:

  ```typescript
  import html2canvas from 'html2canvas'
  import jsPDF from 'jspdf'

  async function exportPDF(elementId: string) {
    const canvas = await html2canvas(document.getElementById(elementId))
    const pdf = new jsPDF()
    pdf.addImage(canvas, 'PNG', 0, 0)
    pdf.save('invoice.pdf')
  }
  ```

### Sonner (토스트)

- **토스트 사용**:

  ```typescript
  import { toast } from 'sonner'

  toast.success('저장되었습니다')
  toast.error('오류가 발생했습니다')
  ```

---

## 워크플로우 표준

### 개발 프로세스

1. **기능 개발**

   ```bash
   npm run dev  # 개발 서버 실행 (Turbopack)
   ```

2. **코드 검사** (커밋 전 필수)

   ```bash
   npm run check-all  # typecheck + lint + format:check
   ```

3. **자동 포매팅**

   ```bash
   npm run lint:fix     # ESLint 자동 수정
   npm run format       # Prettier 포매팅
   ```

4. **커밋**
   - Husky + lint-staged가 자동으로 실행
   - 커밋 메시지는 한국어로 작성
   - 커밋 전 모든 검사 통과 필수

5. **빌드 검증**
   ```bash
   npm run build  # 프로덕션 빌드 테스트
   ```

### Git 커밋 메시지 규칙

- **형식**: `[TYPE] 설명`
- **유형**: feat(기능), fix(버그), docs(문서), chore(설정), refactor(리팩토링), test(테스트)
- **한국어로 작성**:
  - ✅ `feat: 청구서 생성 기능 추가`
  - ❌ `feat: add invoice creation`

### npm Scripts

| 명령어                 | 목적                       |
| ---------------------- | -------------------------- |
| `npm run dev`          | Turbopack 개발 서버 실행   |
| `npm run build`        | 프로덕션 빌드              |
| `npm run start`        | 프로덕션 서버 실행         |
| `npm run lint`         | ESLint 검사                |
| `npm run lint:fix`     | ESLint 자동 수정           |
| `npm run format`       | Prettier 포매팅            |
| `npm run format:check` | Prettier 검사              |
| `npm run typecheck`    | TypeScript 타입 검사       |
| `npm run check-all`    | 모든 검사 통합 실행 (권장) |

---

## 주요 파일 상호작용

### 경로 별칭 설정

- **tsconfig.json**: `"@/*": ["./src/*"]` 설정됨
- **모든 import는 @ 별칭 사용**:
  ```typescript
  import { cn } from '@/lib/utils'
  import { Button } from '@/components/ui/button'
  import type { Invoice } from '@/types'
  ```

### 타입 정의

- **src/types/index.ts**: 글로벌 타입 정의
- **src/types/database.ts**: Supabase 생성 타입
- **각 기능별 타입**: 해당 디렉토리에 정의
  - 예: `src/lib/validations/invoice.ts`

### 환경 변수

- **.env.local**: 로컬 개발 환경 변수
- **NEXT*PUBLIC*\* 접두사**: 브라우저에 노출되는 변수
- **타입 안전성**: `src/lib/env.ts`에서 타입 정의
  ```typescript
  export const env = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
  ```

---

## AI 의사결정 가이드

### 컴포넌트 선택

| 상황      | 결정                  | 근거                       |
| --------- | --------------------- | -------------------------- |
| 버튼 필요 | `shadcn/ui Button`    | 일관된 디자인, 접근성 보장 |
| 커스텀 UI | shadcn 기반 확장      | 통일성 유지, 유지보수 용이 |
| 폼 입력   | React Hook Form + Zod | 검증, 타입 안전성          |
| 아이콘    | Lucide Icons          | 일관된 스타일, 최적화      |

### 서버/클라이언트 선택

| 작업                 | 위치                              | 근거                       |
| -------------------- | --------------------------------- | -------------------------- |
| 데이터 조회          | Server Component / Server Actions | 보안, 성능, 직접 DB 접근   |
| 폼 제출              | Server Actions                    | 보안, CSRF 방지            |
| 상호작용(onClick 등) | Client Component                  | 필요한 경우만 `use client` |
| 상태 관리            | useState + useContext             | 전역 상태는 최소화         |

### 파일 추가 규칙

- **새 컴포넌트**: `src/components/[feature]/ComponentName.tsx`
- **새 유틸리티**: `src/lib/[category]/utilityName.ts`
- **새 검증 스키마**: `src/lib/validations/schemaName.ts`
- **새 페이지**: `src/app/[route]/page.tsx`

---

## 금지사항 (금지됨)

### 절대 금지

- ❌ **CSS-in-JS 라이브러리**: styled-components, Emotion, Tailwind @apply 남용
- ❌ **inline style 속성**: 모든 스타일링은 Tailwind 클래스
- ❌ **클래스 컴포넌트**: 함수형 컴포넌트만 사용
- ❌ **shadcn 없는 UI**: 모든 UI는 shadcn/ui 또는 Radix UI 기반
- ❌ **as any 타입 강제 변환**: 제너릭 또는 타입 가드 사용
- ❌ **상대 경로 import**: 항상 @ 별칭 사용
- ❌ **console.log 남용**: 개발 중에만, 배포 전 제거
- ❌ **하드코딩 값**: 모든 매직 넘버/문자열은 상수 정의
- ❌ **직접 환경 변수 접근**: `process.env` 대신 타입 정의 함수 사용
- ❌ **비동기 작업 무시**: 모든 Promise는 await 또는 .catch() 처리
- ❌ **보안 무시**: RLS 정책 없는 DB 접근, API 키 노출, SQL injection 위험
- ❌ **영어 주석/변수명 혼용**: 주석은 한국어, 코드는 영어

### 신중하게 사용

- ⚠️ **임의 Tailwind 값**: `className="w-[234px]"` 최소화, 설정에 추가 권장
- ⚠️ **useEffect**: 필요한 경우만, 무한 루프 주의
- ⚠️ **전역 상태**: Context 또는 내려받기(prop drilling) 고려
- ⚠️ **외부 라이브러리 추가**: package.json에 추가 전 팀과 상의
- ⚠️ **직접 SQL 쿼리**: Supabase PostgREST API 우선

---

## 문제 해결 가이드

### 문제: ESLint 또는 Prettier 오류

**해결**:

```bash
npm run lint:fix   # ESLint 자동 수정
npm run format     # Prettier 포매팅
npm run check-all  # 최종 검증
```

### 문제: TypeScript 타입 오류

**해결**: 타입 정의 누락 또는 잘못된 타입

- 함수에 매개변수/반환 타입 추가
- `interface` 또는 `type`으로 타입 명시
- `as Type` 대신 제너릭 사용

### 문제: Supabase 연결 실패

**해결**:

- `.env.local`에 올바른 URL/Key 확인
- 네트워크 연결 확인
- 서버/클라이언트 클라이언트 구분 확인

### 문제: 빌드 실패

**해결**:

```bash
npm run check-all  # 사전 검사
npm run build      # 빌드 시도
# 에러 메시지 확인 후 수정
```

---

## 참고 자료

- **개발 로드맵**: `docs/ROADMAP.md`
- **제품 요구사항**: `docs/PRD.md`
- **프로젝트 구조**: `docs/guides/project-structure.md`
- **컴포넌트 패턴**: `docs/guides/component-patterns.md`
- **스타일링 가이드**: `docs/guides/styling-guide.md`
- **폼 처리 가이드**: `docs/guides/forms-react-hook-form.md`
- **Next.js 15.5.3 가이드**: `docs/guides/nextjs-15.md`
- **Notion API 가이드**: `docs/guides/notion-api-guide.md`

---

**최종 업데이트**: 2026-04-04  
**AI 에이전트용 규칙 문서**
