import { authenticateAdmin } from '@/server/auth';
import { HttpError, input, intParam, json, notFound, route } from '@/server/http';
import { type Row } from '@/server/listings';
import { freshTimestamp } from '@/server/profile/update';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** L'administration indique qu'elle a viré le versement à l'hôte (référence du virement facultative). */
export const POST = route<{ id: string }>(async (req, params) => {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'HostPayout');
  const validated = await validate(await input(req), { reference: 'nullable|string|max:255' });

  const payout = must(await db().from('host_payouts').select('id, status').eq('id', id).maybeSingle()) as Row | null;
  if (!payout) {
    notFound('HostPayout', id);
  }
  if (payout.status === 'paid') {
    throw new HttpError(422, { message: 'Ce versement est déjà marqué comme effectué.' });
  }

  const now = freshTimestamp();
  must(
    await db()
      .from('host_payouts')
      .update({ status: 'paid', paid_date: now.slice(0, 10), reference: validated.reference ?? null, updated_at: now })
      .eq('id', id),
  );
  return json({ message: 'Versement marqué comme effectué.' });
});
