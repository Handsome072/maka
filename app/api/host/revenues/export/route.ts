import { authenticate } from '@/server/auth';
import { decimal, ymd } from '@/server/format';
import { input, route } from '@/server/http';
import { applyPeriod, periodBounds, phpTruthy } from '@/server/revenues/mysql';
import { db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

type Row = {
  id: number;
  reservation_id: number;
  gross_amount: number;
  commission_amount: number;
  cleaning_fee: number;
  taxes: number;
  net_amount: number;
  status: string;
  scheduled_date: string | null;
  paid_date: string | null;
  created_at: string | null;
  listing: { title: string | null } | null;
};

/** Interpolation PHP d'une valeur : null → "". */
const str = (value: string | number | null | undefined) => (value === null || value === undefined ? '' : String(value));

/** HostRevenueController::export */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);
  const data = await input(req);
  const year = data.year ?? null;
  const month = data.month ?? null;

  // if ($year) whereYear('created_at', $year) ; if ($month && $year) whereMonth('created_at', $month)
  const period = phpTruthy(year) ? periodBounds(year, month, 'timestamp', phpTruthy(month)) : null;

  const payouts =
    period === false
      ? []
      : await fetchAll<Row>(() => {
          let query = db()
            .from('host_payouts')
            .select(
              'id,reservation_id,gross_amount,commission_amount,cleaning_fee,taxes,net_amount,status,scheduled_date,paid_date,created_at,listing:listings!host_payouts_listing_id_fkey(title)',
            )
            .eq('host_id', user.id);
          if (period) {
            query = applyPeriod(query, 'created_at', period);
          }
          return query.order('created_at', { ascending: false, nullsFirst: false }).order('id', { ascending: false });
        });

  let csv = 'Date,Reservation,Annonce,Montant brut,Commission,Frais menage,Taxes,Revenu net,Statut\n';

  for (const p of payouts) {
    const date = ymd(p.paid_date) ?? ymd(p.scheduled_date) ?? ymd(p.created_at);
    const reservation = `RES-${p.reservation_id}`;
    const listing = (p.listing?.title ?? '').replaceAll(',', ' ');
    csv += `${str(date)},${reservation},${listing},${str(decimal(p.gross_amount, 2))},${str(decimal(p.commission_amount, 2))},${str(decimal(p.cleaning_fee, 2))},${str(decimal(p.taxes, 2))},${str(decimal(p.net_amount, 2))},${p.status}\n`;
  }

  const filename = `revenus-${year ?? 'all'}${phpTruthy(month) ? `-${month}` : ''}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      // Symfony Response::prepare() ajoute le charset aux types text/*
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
});
