import { authenticate } from '@/server/auth';
import { json, route } from '@/server/http';
import { formatPublicProfile } from '@/server/profile/format';
import { db } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** UserProfileController::publicProfile */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  const { count, error } = await db()
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'active');
  if (error) {
    throw error;
  }

  return json({ profile: formatPublicProfile(user, count ?? 0) });
});
