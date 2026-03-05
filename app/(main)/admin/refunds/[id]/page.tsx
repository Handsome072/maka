import { AdminRefundDetail } from '@/app/pages/AdminRefundDetail';

export function generateStaticParams() {
  return [
    { id: 'REM-001' }, { id: 'REM-002' }, { id: 'REM-003' }, { id: 'REM-004' },
    { id: 'REM-005' }, { id: 'REM-006' }, { id: 'REM-007' }, { id: 'REM-008' },
    { id: 'REM-009' }, { id: 'REM-010' }, { id: 'REM-011' }, { id: 'REM-012' },
  ];
}

export default function AdminRefundDetailPage() {
  return <AdminRefundDetail />;
}
