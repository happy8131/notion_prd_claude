import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import {
  getNotionClient,
  ITEMS_DATA_SOURCE_ID,
  initializeItemsDataSourceId,
} from './client'
import { transformNotionPageToInvoiceItem } from './transformers'
import type { InvoiceItem } from '@/types'

/**
 * Notion API에서 특정 견적서의 상품 목록을 조회합니다.
 *
 * @param invoiceId 견적서(Invoice) Notion 페이지 ID
 * @returns 해당 견적서의 상품 목록 배열
 */
export async function getItemsByInvoiceId(
  invoiceId: string
): Promise<InvoiceItem[]> {
  try {
    // 1. 데이터소스 ID 초기화 (환경변수 없으면 DB 조회)
    await initializeItemsDataSourceId()

    // 2. 전체 Items 데이터 fetch (page_size=100)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (getNotionClient() as any).dataSources.query({
      data_source_id: ITEMS_DATA_SOURCE_ID,
      page_size: 100,
    })

    // 3. InvoiceItem 타입으로 변환 (invoiceId는 Relations에서 추출)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: InvoiceItem[] = (result.results as any[])
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) => p.object === 'page'
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p: any) =>
        transformNotionPageToInvoiceItem(p as PageObjectResponse)
      )

    // 4. in-memory 필터: 현재 invoiceId와 연결된 Items만 선별
    items = items.filter(item => item.invoiceId === invoiceId)

    return items
  } catch (error) {
    console.error('[getItemsByInvoiceId] Notion API 오류:', error)
    throw new Error('상품 목록 조회 실패')
  }
}
