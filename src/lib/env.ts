import { z } from 'zod'

// 서버 사이드 전용 환경 변수 스키마
const serverEnvSchema = z.object({
  // 실행 환경
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Supabase 서버 전용 키 (서비스 역할 키)
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'Supabase 서비스 키가 필요합니다'),

  // Notion API 설정
  NOTION_API_KEY: z.string().min(1, 'Notion API 키가 필요합니다'),
  NOTION_INVOICE_DATABASE_ID: z
    .string()
    .min(1, 'Notion 견적서 데이터베이스 ID가 필요합니다'),
})

// 클라이언트/서버 공용 환경 변수 스키마 (NEXT_PUBLIC_ 접두사 필수)
const publicEnvSchema = z.object({
  // Supabase 공개 설정
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('유효한 Supabase URL이 필요합니다'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'Supabase 익명 키가 필요합니다'),

  // 앱 URL
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
})

// 서버 환경 변수 파싱 (서버 컴포넌트 / API Route에서만 사용)
function parseServerEnv() {
  const result = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
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

// 공개 환경 변수 파싱 (클라이언트/서버 공용)
function parsePublicEnv() {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  })

  if (!result.success) {
    console.error(
      '공개 환경 변수 설정 오류:',
      result.error.flatten().fieldErrors
    )
    throw new Error('필수 공개 환경 변수가 누락되었습니다')
  }

  return result.data
}

// 서버 전용 환경 변수 (서버 컴포넌트 / Route Handler에서 import)
export const serverEnv = parseServerEnv()

// 공개 환경 변수 (어디서든 사용 가능)
export const publicEnv = parsePublicEnv()

// 타입 익스포트
export type ServerEnv = z.infer<typeof serverEnvSchema>
export type PublicEnv = z.infer<typeof publicEnvSchema>
