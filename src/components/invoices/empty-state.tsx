/**
 * 검색 결과 없음 상태를 표시하는 컴포넌트
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-16 text-center">
      <div className="mb-2 text-4xl">📭</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        검색 결과가 없습니다
      </h3>
      <p className="text-sm text-gray-600">
        다른 검색어나 필터를 시도해보세요.
      </p>
    </div>
  )
}
