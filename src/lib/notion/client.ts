import { Client } from '@notionhq/client'

/**
 * Notion API 클라이언트 싱글톤 인스턴스
 * 서버 사이드 전용 (서버 컴포넌트 / Route Handler에서만 사용)
 */
export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
})

/**
 * 견적서 데이터베이스 ID
 * Notion 데이터베이스 URL에서 추출된 32자리 ID
 */
export const INVOICE_DATABASE_ID = process.env.NOTION_INVOICE_DATABASE_ID ?? ''
