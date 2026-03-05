import { AdminPaymentDetail } from '@/app/pages/AdminPaymentDetail';

export function generateStaticParams() {
  return [
    { id: 'PAY-10001' }, { id: 'PAY-10002' }, { id: 'PAY-10003' }, { id: 'PAY-10004' },
    { id: 'PAY-10005' }, { id: 'PAY-10006' }, { id: 'PAY-10007' }, { id: 'PAY-10008' },
    { id: 'PAY-10009' }, { id: 'PAY-10010' }, { id: 'PAY-10011' }, { id: 'PAY-10012' },
  ];
}

export default function AdminPaymentDetailPage() {
  return <AdminPaymentDetail />;
}
