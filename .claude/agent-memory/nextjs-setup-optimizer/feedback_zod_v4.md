---
name: Zod v4 API 변경사항
description: Zod v4에서 required_error 옵션이 제거됨 - error 옵션으로 대체
type: feedback
---

Zod v4(zod ^4.x)에서 `z.enum()`, `z.string()` 등의 `required_error` 파라미터가 제거되었다. 대신 단일 `error` 옵션을 사용한다.

**Why:** Zod v4 breaking change - API가 단순화되어 모든 오류 메시지를 `error` 하나로 처리.

**How to apply:** Zod 스키마 작성 시 `required_error`, `invalid_type_error` 대신 `error` 사용.

```typescript
// v3 (잘못됨)
z.enum(['A', 'B'], { required_error: '선택 필요' })

// v4 (올바름)
z.enum(['A', 'B'], { error: '선택 필요' })
```
