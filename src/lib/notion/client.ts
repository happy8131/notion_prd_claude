import { Client } from '@notionhq/client'

// 클라이언트 캐싱 (동적 초기화)
let cachedClient: InstanceType<typeof Client> | null = null

/**
 * Notion API 클라이언트 인스턴스를 가져오거나 생성합니다.
 * Turbopack 호환성을 위해 동적 초기화를 사용합니다.
 */
export function getNotionClient(): InstanceType<typeof Client> {
  if (!cachedClient) {
    cachedClient = new Client({
      auth: process.env.NOTION_API_KEY,
    })
  }
  return cachedClient
}

/**
 * Notion API 클라이언트 싱글톤 인스턴스 (하위 호환성)
 * 서버 사이드 전용 (서버 컴포넌트 / Route Handler에서만 사용)
 * @deprecated getNotionClient() 함수를 사용하세요.
 */
export const notionClient = getNotionClient()

/**
 * 견적서 데이터베이스 ID
 * Notion 데이터베이스 URL에서 추출된 32자리 ID
 */
export const INVOICE_DATABASE_ID = process.env.NOTION_INVOICE_DATABASE_ID ?? ''

/**
 * 견적서 데이터소스 ID
 * Notion이 deprecated한 databases.query 대신 dataSources.query를 사용하기 위해 필요
 * (첫 로드 시 데이터베이스에서 동적으로 가져옴)
 */
export let INVOICE_DATA_SOURCE_ID =
  process.env.NOTION_INVOICE_DATA_SOURCE_ID ?? ''

/**
 * 견적서 데이터소스 ID를 초기화합니다.
 * 환경 변수에 없으면 데이터베이스 조회로부터 가져옵니다.
 */
export async function initializeDataSourceId(): Promise<void> {
  if (INVOICE_DATA_SOURCE_ID) {
    return
  }

  try {
    const notionClient = getNotionClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const database = await (notionClient as any).databases.retrieve({
      database_id: INVOICE_DATABASE_ID,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataSources = (database as any).data_sources
    if (dataSources && dataSources.length > 0) {
      INVOICE_DATA_SOURCE_ID = dataSources[0].id
    }
  } catch (error) {
    console.error('데이터소스 ID를 초기화할 수 없습니다:', error)
  }
}
