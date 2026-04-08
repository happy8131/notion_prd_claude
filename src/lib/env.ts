import { z } from 'zod'

// 서버 사이드 전용 환경 변수 스키마
const serverEnvSchema = z.object({
  // 실행 환경
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Notion API 설정
  NOTION_API_KEY: z.string().min(1, 'Notion API 키가 필요합니다'),
  NOTION_INVOICE_DATABASE_ID: z
    .string()
    .min(1, 'Notion 견적서 데이터베이스 ID가 필요합니다'),
})

// 서버 환경 변수 파싱 (서버 컴포넌트 / API Route에서만 사용)
function parseServerEnv() {
  const result = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_INVOICE_DATABASE_ID: process.env.NOTION_INVOICE_DATABASE_ID,
  })

  if (!result.success) {
    console.error(
      '서버 환경 변수 설정 오류:',
      result.error.flatten().fieldErrors
    )
    throw new Error('필수 서버 환경 변수가 누락되었습니다')
  }

  return result.data
}

// 서버 전용 환경 변수 (서버 컴포넌트 / Route Handler에서 import)
export const serverEnv = parseServerEnv()

// 타입 익스포트
export type ServerEnv = z.infer<typeof serverEnvSchema>
