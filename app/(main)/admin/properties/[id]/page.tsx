import { AdminPropertyDetail } from '@/app/pages/AdminPropertyDetail';

export function generateStaticParams() {
  return Array.from({ length: 500 }, (_, i) => ({ id: String(i + 1) }));
}

export default function AdminPropertyDetailPage() {
  return <AdminPropertyDetail />;
}
