---
name: Notion API 핵심 패턴
description: Notion API v1의 속성 타입 매핑, 쿼리 필터 구성, 타입 변환, 레이트 리밋 처리 등 실전 패턴
type: reference
---

## 속성 타입 선택 기준

- 배열/중첩 데이터: Notion에 배열 타입이 없음. JSON 직렬화 후 rich_text 저장 (최대 2,000자 제한 주의)
- 상태 필드: select 타입 권장 (status 타입보다 커스터마이징 유연함)
- 이메일: email 타입 사용 시 유효성 검증 + mailto 링크 자동 생성
- 금액: number 타입에 format("won"/"dollar") 지정 가능

## 쿼리 필터 패턴

- 필터 조건 1개: `{ filter: filterCondition }` 직접 전달
- 필터 조건 2개+: `{ filter: { and: [...conditions] } }` 배열로 묶기
- 필터 없음: filter 키 자체를 생략 (빈 객체 전달 시 validation_error 발생 가능)

## 타입 가드 필수 패턴

Notion API 응답은 `PageObjectResponse | PartialPageObjectResponse` 유니온.
`PartialPageObjectResponse`에는 `properties`가 없으므로 반드시 타입 가드 필요:

```typescript
const pages = response.results.filter(
  (page): page is PageObjectResponse => page.object === 'page'
)
```

## 레이트 리밋

- 제한: 초당 3회 (Average)
- 초과 시: HTTP 429 반환
- 재시도 전략: 지수 백오프 (1초 → 2초 → 4초, 최대 10초)
- 재시도 가능 코드: 429, 502, 503, internal_server_error

## 자주 발생하는 에러

| 코드                | 원인                              |
| ------------------- | --------------------------------- |
| object_not_found    | DB 미공유 또는 잘못된 ID          |
| restricted_resource | Integration을 DB에 공유하지 않음  |
| validation_error    | 속성 타입 불일치 또는 속성명 오타 |
| rate_limited        | 초당 3회 초과                     |

## 중요 제약사항

- rich_text 최대 2,000자 → 대용량 JSON 저장 시 별도 DB + relation 고려
- 상품 목록 등 배열 데이터는 별도 DB + relation 연결이 확장성에 유리
- status 타입의 name/options는 API로 수정 불가 (Notion UI에서만 가능)
- 속성명은 Notion DB 열 이름과 정확히 일치해야 함 (대소문자, 공백 포함)
