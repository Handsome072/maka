import { AdminClientProfile } from '@/app/pages/AdminClientProfile';

export function generateStaticParams() {
  return Array.from({ length: 500 }, (_, i) => ({ id: String(i + 1) }));
}

export default function AdminClientProfilePage() {
  return <AdminClientProfile />;
}
