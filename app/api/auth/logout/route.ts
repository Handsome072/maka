import { authenticate } from '@/server/auth';
import { json, route } from '@/server/http';
import { db } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** Révoque uniquement la session courante, comme $request->user()->currentAccessToken()->delete(). */
export const POST = route(async (req) => {
  const { token } = await authenticate(req);

  const { error } = await db().auth.admin.signOut(token, 'local');
  if (error) {
    console.error('[auth/logout] révocation de session', error);
  }

  return json({ message: 'Déconnexion réussie.' });
});
