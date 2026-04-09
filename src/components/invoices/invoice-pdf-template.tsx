'use client'

import type { Invoice, InvoiceStatus } from '@/types'

interface InvoicePdfTemplateProps {
  invoice: Invoice
}

/**
 * PDF 다운로드용 인쇄 레이아웃 컴포넌트
 * 화면에 표시되지 않으며, html2canvas로 캡처되어 PDF로 변환됨
 * 주의: html2canvas는 일부 Tailwind 색상을 지원하지 않으므로 인라인 스타일 사용
 */
export function InvoicePdfTemplate({ invoice }: InvoicePdfTemplateProps) {
  // 상태 라벨 매핑
  const statusLabel: Record<InvoiceStatus, string> = {
    DRAFT: '대기',
    SENT: '발송',
    ACCEPTED: '수락',
    EXPIRED: '만료',
  }

  // 금액 포맷
  const formatAmount = (amount: number): string => {
    if (invoice.currency === 'KRW') {
      return `₩${amount.toLocaleString('ko-KR')}`
    }
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div
      id="invoice-pdf-template"
      style={{
        width: '794px',
        backgroundColor: '#ffffff',
        color: '#111827',
        padding: '48px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          borderBottom: '2px solid #d1d5db',
          paddingBottom: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold' }}>견적서</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
            {invoice.invoiceNumber}
          </p>
        </div>
      </div>

      {/* 기본 정보 */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}
        >
          기본 정보
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          {[
            { label: '발행일', value: formatDate(invoice.createdDate) },
            { label: '유효기간', value: formatDate(invoice.expiryDate) },
            { label: '상태', value: statusLabel[invoice.status] },
            { label: '통화', value: invoice.currency },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                padding: '12px',
              }}
            >
              <p style={{ fontSize: '12px', color: '#4b5563' }}>{item.label}</p>
              <p style={{ fontWeight: '600' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 고객 정보 */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}
        >
          고객 정보
        </h2>
        <div>
          <div style={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', color: '#4b5563' }}>고객명</p>
            <p style={{ fontWeight: '600' }}>{invoice.customerName}</p>
          </div>
          {invoice.customerEmail && (
            <div>
              <p style={{ fontSize: '12px', color: '#4b5563' }}>이메일</p>
              <p style={{ fontWeight: '600' }}>{invoice.customerEmail}</p>
            </div>
          )}
        </div>
      </div>

      {/* 상품 목록 */}
      {invoice.items && invoice.items.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2
            style={{
              marginBottom: '16px',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            상품 목록
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th
                  style={{
                    border: '1px solid #d1d5db',
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  상품명
                </th>
                <th
                  style={{
                    border: '1px solid #d1d5db',
                    padding: '12px',
                    textAlign: 'right',
                    fontWeight: '600',
                  }}
                >
                  수량
                </th>
                <th
                  style={{
                    border: '1px solid #d1d5db',
                    padding: '12px',
                    textAlign: 'right',
                    fontWeight: '600',
                  }}
                >
                  단가
                </th>
                <th
                  style={{
                    border: '1px solid #d1d5db',
                    padding: '12px',
                    textAlign: 'right',
                    fontWeight: '600',
                  }}
                >
                  합계
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>
                    {item.itemName}
                  </td>
                  <td
                    style={{
                      border: '1px solid #d1d5db',
                      padding: '12px',
                      textAlign: 'right',
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      border: '1px solid #d1d5db',
                      padding: '12px',
                      textAlign: 'right',
                    }}
                  >
                    {formatAmount(item.unitPrice)}
                  </td>
                  <td
                    style={{
                      border: '1px solid #d1d5db',
                      padding: '12px',
                      textAlign: 'right',
                      fontWeight: '600',
                    }}
                  >
                    {formatAmount(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 금액 요약 */}
      <div style={{ marginBottom: '32px', maxWidth: '320px' }}>
        <h2
          style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}
        >
          금액 요약
        </h2>
        <div style={{ border: '1px solid #d1d5db', padding: '16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span>소계</span>
            <span style={{ fontWeight: '600' }}>
              {formatAmount(invoice.totalAmount)}
            </span>
          </div>
          <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '8px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              <span>총 금액</span>
              <span style={{ color: '#2563eb' }}>
                {formatAmount(invoice.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 비고 */}
      {invoice.notes && (
        <div>
          <h2
            style={{
              marginBottom: '16px',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            비고
          </h2>
          <div
            style={{
              border: '1px solid #d1d5db',
              backgroundColor: '#f9fafb',
              padding: '16px',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                color: '#374151',
              }}
            >
              {invoice.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
