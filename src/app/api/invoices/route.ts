import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { invoiceFilterSchema } from '@/lib/validations/invoice'
import { getInvoiceList } from '@/lib/notion/invoice-service'
import type { ApiResponse, PaginatedResponse, Invoice } from '@/types'

/**
 * GET /api/invoices
 *
 * 견적서 목록을 조회합니다.
 *
 * 쿼리 파라미터:
 * - search: string (optional) - 견적서 번호 또는 고객명으로 검색
 * - status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'EXPIRED' (optional) - 상태 필터
 * - currency: 'KRW' | 'USD' (optional) - 통화 필터 (현재 사용되지 않음)
 * - dateFrom: string (optional) - 시작일 필터 (YYYY-MM-DD)
 * - dateTo: string (optional) - 종료일 필터 (YYYY-MM-DD)
 * - page: number (optional, default: 1) - 페이지 번호
 * - limit: number (optional, default: 20, max: 100) - 페이지당 항목 수
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    // URL searchParams를 객체로 변환
    const paramsObject: Record<string, string | number | undefined> = {}
    searchParams.forEach((value, key) => {
      if (key === 'page' || key === 'limit') {
        paramsObject[key] = Number(value)
      } else {
        paramsObject[key] = value
      }
    })

    // Zod로 파라미터 검증
    const filterSchema = invoiceFilterSchema.extend({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
    })

    const parsed = filterSchema.safeParse(paramsObject)

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: '잘못된 요청 파라미터',
          code: 'INVALID_PARAMS',
        },
        { status: 400 }
      )
    }

    // 견적서 목록 조회
    const result = await getInvoiceList(parsed.data)

    return NextResponse.json<ApiResponse<PaginatedResponse<Invoice>>>(
      {
        success: true,
        data: result,
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60', // 60초 캐싱
        },
      }
    )
  } catch (error) {
    console.error('[GET /api/invoices] 오류:', error)

    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: 'Notion 데이터 조회 실패',
        code: 'NOTION_ERROR',
      },
      { status: 500 }
    )
  }
}
