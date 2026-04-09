import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types'

/**
 * Notion 상태값을 Invoice 영문 상태로 매핑
 * (한국어 또는 영문 모두 지원)
 */
const STATUS_MAP: Record<string, InvoiceStatus> = {
  // 한국어 상태
  대기: 'DRAFT',
  발송: 'SENT',
  수락: 'ACCEPTED',
  만료: 'EXPIRED',
  // 영문 상태
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  EXPIRED: 'EXPIRED',
}

/**
 * Notion 프로퍼티에서 Title 텍스트 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTitle(prop: any): string {
  if (!prop || prop.type !== 'title') return ''
  return prop.title?.[0]?.plain_text ?? ''
}

/**
 * Notion 프로퍼티에서 RichText 텍스트 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractRichText(prop: any): string {
  if (!prop || prop.type !== 'rich_text') return ''
  return prop.rich_text?.[0]?.plain_text ?? ''
}

/**
 * Notion 프로퍼티에서 Number 값 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractNumber(prop: any): number {
  if (!prop || prop.type !== 'number') return 0
  return prop.number ?? 0
}

/**
 * Notion 프로퍼티에서 Date 값 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractDate(prop: any): string {
  if (!prop || prop.type !== 'date') return ''
  return prop.date?.start ?? ''
}

/**
 * Notion 프로퍼티에서 Select 값 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractSelect(prop: any): string {
  if (!prop || prop.type !== 'select') return ''
  return prop.select?.name ?? ''
}

/**
 * Notion 프로퍼티에서 Status 값 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractStatus(prop: any): string {
  if (!prop || prop.type !== 'status') return ''
  return prop.status?.name ?? ''
}

/**
 * Notion 프로퍼티에서 Email 값 추출
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractEmail(prop: any): string {
  if (!prop || prop.type !== 'email') return ''
  return prop.email ?? ''
}

/**
 * Notion 프로퍼티에서 Relation 값 추출 (첫번째 연결된 ID)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractRelation(prop: any): string {
  if (!prop || prop.type !== 'relation') return ''
  const relations = prop.relation ?? []
  return relations.length > 0 ? relations[0].id : ''
}

/**
 * Notion 페이지를 Invoice 타입으로 변환
 *
 * @param page Notion API에서 반환된 PageObjectResponse
 * @returns Invoice 타입으로 변환된 객체
 */
export function transformNotionPageToInvoice(
  page: PageObjectResponse
): Invoice {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = page.properties as any

  // 상태 변환 (status 타입 또는 select)
  let rawStatus = extractStatus(props['상태'])
  if (!rawStatus) {
    rawStatus = extractSelect(props['상태'])
  }
  const status: InvoiceStatus = STATUS_MAP[rawStatus] ?? 'DRAFT'

  // 통화 (기본값: KRW, 프로퍼티 없으므로)
  const currency = 'KRW'

  return {
    id: page.id,
    invoiceNumber: extractTitle(props['견적서 번호']),
    customerName: extractRichText(props['클라이언트 이름']),
    customerEmail: extractEmail(props['고객 이메일']) ?? '',
    totalAmount: extractNumber(props['총금액']),
    currency,
    status,
    createdDate: extractDate(props['발행일']),
    expiryDate: extractDate(props['유효기간']),
    notes: extractRichText(props['비고']) || undefined,
    syncedAt: page.last_edited_time,
  }
}

/**
 * Notion 페이지를 InvoiceItem 타입으로 변환
 *
 * @param page Notion API에서 반환된 PageObjectResponse
 * @returns InvoiceItem 타입으로 변환된 객체
 */
export function transformNotionPageToInvoiceItem(
  page: PageObjectResponse
): InvoiceItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = page.properties as any

  // CSV 데이터 기반 프로퍼티명: 항목명, invoices (Relations), 수량, 단가, 금액
  const itemName = extractTitle(props['항목명']) || ''
  const invoiceId = extractRelation(props['invoices']) || ''
  const quantity = extractNumber(props['수량'])
  const unitPrice = extractNumber(props['단가'])
  const amount = extractNumber(props['금액'])

  return {
    id: page.id,
    invoiceId,
    itemName,
    quantity,
    unitPrice,
    amount,
  }
}
