import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import {
  getNotionClient,
  INVOICE_DATA_SOURCE_ID,
  initializeDataSourceId,
} from './client'
import { transformNotionPageToInvoice } from './transformers'
import type { Invoice, InvoiceListParams, PaginatedResponse } from '@/types'

/**
 * Notion API에서 견적서 목록을 조회하고 필터링, 페이지네이션 처리
 *
 * @param params 검색 및 필터 파라미터 (search, status, currency, dateFrom, dateTo, page, limit)
 * @returns 페이지네이션 처리된 견적서 목록
 */
export async function getInvoiceList(
  params: InvoiceListParams
): Promise<PaginatedResponse<Invoice>> {
  const {
    search,
    status,
    currency,
    dateFrom,
    dateTo,
    page = 1,
    limit = 20,
  } = params

  try {
    // 1. 데이터소스 ID 초기화 (환경변수 없으면 DB 조회)
    await initializeDataSourceId()

    // 2. 전체 데이터 fetch (page_size=100)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (getNotionClient() as any).dataSources.query({
      data_source_id: INVOICE_DATA_SOURCE_ID,
      page_size: 100,
    })

    // 3. Invoice 타입으로 변환
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let invoices: Invoice[] = (result.results as any[])
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) => p.object === 'page'
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p: any) => transformNotionPageToInvoice(p as PageObjectResponse))

    // 4. in-memory 필터
    if (status) {
      invoices = invoices.filter(inv => inv.status === status)
    }
    if (currency) {
      invoices = invoices.filter(inv => inv.currency === currency)
    }
    if (dateFrom) {
      invoices = invoices.filter(inv => inv.createdDate >= dateFrom)
    }
    if (dateTo) {
      invoices = invoices.filter(inv => inv.createdDate <= dateTo)
    }
    if (search) {
      const lower = search.toLowerCase()
      invoices = invoices.filter(
        inv =>
          inv.invoiceNumber.toLowerCase().includes(lower) ||
          inv.customerName.toLowerCase().includes(lower)
      )
    }

    // 5. 정렬: 발행일 내림차순
    invoices.sort((a, b) => b.createdDate.localeCompare(a.createdDate))

    // 6. 페이지네이션
    const total = invoices.length
    const start = (page - 1) * limit
    const data = invoices.slice(start, start + limit)
    const hasMore = start + limit < total

    return {
      data,
      total,
      page,
      limit,
      hasMore,
    }
  } catch (error) {
    console.error('[getInvoiceList] Notion API 오류:', error)
    throw new Error('Notion 데이터 조회 실패')
  }
}

/**
 * Notion API에서 단일 견적서 조회
 * Notion 페이지 ID로 직접 조회
 */
export async function getInvoiceById(
  invoiceId: string
): Promise<Invoice | null> {
  try {
    const page = await getNotionClient().pages.retrieve({
      page_id: invoiceId,
    })
    return transformNotionPageToInvoice(page as PageObjectResponse)
  } catch (error) {
    console.error('[getInvoiceById] Notion API 오류:', error)
    return null
  }
}
