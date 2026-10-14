import { adminOverview, overviewPeriod } from '@/server/admin-overview';
import { authenticateAdmin } from '@/server/auth';
import { json, route } from '@/server/http';

export const dynamic = 'force-dynamic';

/** Synthèse du dashboard général (?period=7d|30d|3m|12m, 30 jours par défaut). */
export const GET = route(async (req) => {
  await authenticateAdmin(req);
  return json(await adminOverview(overviewPeriod(req.nextUrl.searchParams.get('period'))));
});
