import { authenticate } from '@/server/auth';
import { json, route } from '@/server/http';
import { mysqlCompare } from '@/server/revenues/mysql';
import { db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** HostRevenueController::listings */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  const listings = await fetchAll<{ id: number; title: string | null; city: string | null }>(() =>
    db().from('listings').select('id,title,city').eq('user_id', user.id).order('id'),
  );

  // ->orderBy('title') : tri selon utf8mb4_unicode_ci (casse et accents ignorés, NULL en premier)
  listings.sort((a, b) => mysqlCompare(a.title, b.title) || a.id - b.id);

  return json({ listings });
});
