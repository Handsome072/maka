import { authenticateAdmin } from '@/server/auth';
import { json, route } from '@/server/http';

export const dynamic = 'force-dynamic';

/** Route::get('/check') du groupe admin */
export const GET = route(async (req) => {
  await authenticateAdmin(req);
  return json({ admin: true });
});
