import { iso8601 } from '@/server/format';
import { abort, json, route } from '@/server/http';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/**
 * Appelée une fois par jour par Vercel Cron (vercel.json). Le plan gratuit Supabase met le projet
 * en pause après 7 jours sans activité : une vraie requête sur la base suffit à l'éviter.
 * Si CRON_SECRET est défini sur Vercel, Vercel l'envoie en « Bearer » et seuls ses appels passent.
 */
export const GET = route(async (req) => {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    abort(401, 'Unauthenticated.');
  }

  must(await db().from('listings').select('id', { count: 'exact', head: true }));

  return json({ status: 'ok', timestamp: iso8601(new Date()) });
});
