// ============================================
// 견적서 애플리케이션 공통 타입 정의
// ============================================

// --------------------------------------------
// 사용자 관련 타입
// --------------------------------------------

/** 사용자 역할 */
export type UserRole = 'SALES' | 'CLIENT'

/** 인증된 사용자 정보 */
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  /** 고객명 (클라이언트 역할인 경우에만 존재) */
  customerName?: string
  createdAt: string
  updatedAt: string
}

// --------------------------------------------
// 견적서 관련 타입
// --------------------------------------------

/** 견적서 상태 */
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'EXPIRED'

/** 통화 단위 */
export type Currency = 'KRW' | 'USD'

/** 견적서 상품 항목 */
export interface InvoiceItem {
  id: string
  invoiceId: string
  /** 상품명 */
  itemName: string
  /** 수량 */
  quantity: number
  /** 단가 */
  unitPrice: number
  /** 금액 (수량 × 단가) */
  amount: number
}

/** 견적서 */
export interface Invoice {
  /** Notion 페이지 ID */
  id: string
  /** 견적서 번호 (예: INV-2024-001) */
  invoiceNumber: string
  /** 고객명 */
  customerName: string
  /** 고객 이메일 */
  customerEmail: string
  /** 총 금액 */
  totalAmount: number
  /** 통화 단위 */
  currency: Currency
  /** 견적서 상태 */
  status: InvoiceStatus
  /** 작성일 (ISO 8601) */
  createdDate: string
  /** 유효기간 (ISO 8601) */
  expiryDate: string
  /** 비고 */
  notes?: string
  /** Notion 마지막 동기화 시간 */
  syncedAt: string
  /** 상품 목록 */
  items?: InvoiceItem[]
}

/** 견적서 목록 조회 파라미터 */
export interface InvoiceListParams {
  /** 검색어 (견적서 번호 또는 고객명) */
  search?: string
  /** 상태 필터 */
  status?: InvoiceStatus
  /** 통화 필터 */
  currency?: Currency
  /** 시작일 필터 */
  dateFrom?: string
  /** 종료일 필터 */
  dateTo?: string
  /** 페이지 번호 (1부터 시작) */
  page?: number
  /** 페이지당 항목 수 */
  limit?: number
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// --------------------------------------------
// API 응답 타입
// --------------------------------------------

/** 성공 응답 */
export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

/** 오류 응답 */
export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
}

/** API 응답 통합 타입 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
