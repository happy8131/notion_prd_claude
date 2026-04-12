import { redirect } from 'next/navigation'

/**
 * /admin 진입점
 * /admin/invoices 로 리디렉트
 */
export default function AdminPage() {
  redirect('/admin/invoices')
}
