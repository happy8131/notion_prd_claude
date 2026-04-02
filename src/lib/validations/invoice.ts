import { z } from 'zod'

// --------------------------------------------
// 견적서 목록 검색/필터 스키마
// --------------------------------------------
export const invoiceFilterSchema = z.object({
  /** 검색어 (견적서 번호 또는 고객명) */
  search: z.string().optional(),
  /** 상태 필터 */
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'EXPIRED']).optional(),
  /** 통화 필터 */
  currency: z.enum(['KRW', 'USD']).optional(),
  /** 시작일 필터 (YYYY-MM-DD) */
  dateFrom: z.string().optional(),
  /** 종료일 필터 (YYYY-MM-DD) */
  dateTo: z.string().optional(),
})

export type InvoiceFilterValues = z.infer<typeof invoiceFilterSchema>
