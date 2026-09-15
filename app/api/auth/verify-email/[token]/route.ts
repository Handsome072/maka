import { authUserPayload, randomString } from '@/server/account';
import type { UserRow } from '@/server/auth';
import { json, route } from '@/server/http';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

export const GET = route<{ token: string }>(async (_req, { token }) => {
  const user = must(
    await db().from('users').select('*').eq('email_verification_token', token).limit(1).maybeSingle(),
  ) as UserRow | null;

  if (!user) {
    return json({ message: 'Token de vérification invalide ou expiré.' }, 400);
  }

  // Le même champ sert ensuite de jeton pour définir le mot de passe
  const passwordSetupToken = randomString(64);
  must(
    await db()
      .from('users')
      .update({
        email_verified_at: new Date().toISOString(),
        email_verification_token: `pwd_${passwordSetupToken}`,
      })
      .eq('id', user.id),
  );

  return json({
    message: 'Email vérifié avec succès.',
    password_setup_token: passwordSetupToken,
    user: authUserPayload(user, true),
  });
});
