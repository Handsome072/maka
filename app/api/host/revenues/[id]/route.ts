import { authenticate } from '@/server/auth';
import { decimal, float, iso8601, round, ymd } from '@/server/format';
import { intParam, json, notFound, route } from '@/server/http';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

type Row = {
  id: number;
  reservation_id: number;
  gross_amount: number;
  cleaning_fee: number;
  commission_rate: number;
  commission_amount: number;
  taxes: number;
  net_amount: number;
  currency: string;
  status: string;
  scheduled_date: string | null;
  paid_date: string | null;
  reference: string | null;
  created_at: string;
  listing: { id: number; title: string | null; city: string | null } | null;
  reservation: {
    id: number;
    check_in: string | null;
    check_out: string | null;
    total_price: number | null;
    guests_count: number;
  } | null;
};

/** HostRevenueController::show */
export const GET = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'HostPayout');

  const payout = must(
    await db()
      .from('host_payouts')
      .select(
        'id,reservation_id,gross_amount,cleaning_fee,commission_rate,commission_amount,taxes,net_amount,currency,status,scheduled_date,paid_date,reference,created_at,' +
          'listing:listings!host_payouts_listing_id_fkey(id,title,city),' +
          'reservation:reservations!host_payouts_reservation_id_fkey(id,check_in,check_out,total_price,guests_count)',
      )
      .eq('host_id', user.id)
      .eq('id', id)
      .maybeSingle(),
  ) as Row | null;

  if (!payout) {
    notFound('HostPayout', id);
  }

  return json({
    payout: {
      id: payout.id,
      reservation_id: payout.reservation_id,
      listing: payout.listing
        ? { id: payout.listing.id, title: payout.listing.title, city: payout.listing.city }
        : null,
      reservation: payout.reservation
        ? {
            id: payout.reservation.id,
            check_in: ymd(payout.reservation.check_in),
            check_out: ymd(payout.reservation.check_out),
            total_price: decimal(payout.reservation.total_price, 2),
            guests_count: payout.reservation.guests_count,
          }
        : null,
      gross_amount: round(float(payout.gross_amount), 2),
      cleaning_fee: round(float(payout.cleaning_fee), 2),
      commission_rate: round(float(payout.commission_rate), 2),
      commission_amount: round(float(payout.commission_amount), 2),
      taxes: round(float(payout.taxes), 2),
      net_amount: round(float(payout.net_amount), 2),
      currency: payout.currency,
      status: payout.status,
      scheduled_date: ymd(payout.scheduled_date),
      paid_date: ymd(payout.paid_date),
      reference: payout.reference,
      created_at: iso8601(payout.created_at),
    },
  });
});
