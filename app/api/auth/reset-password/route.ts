import { authUserPayload, revokeAllSessions, setUserPassword, tokenMatches } from '@/server/account';
import type { UserRow } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

const LINK_LIFETIME_MS = 60 * 60 * 1000;

/**
 * Réinitialise le mot de passe avec le lien reçu par email et révoque toutes les sessions.
 * Le navigateur ouvre ensuite une nouvelle session Supabase avec le nouveau mot de passe.
 */
export const POST = route(async (req) => {
  const validated = await validate<{ email: string; token: string; password: string }>(await input(req), {
    email: ['required', 'email'],
    token: ['required', 'string'],
    password: ['required', 'string', 'min:8', 'confirmed'],
    password_confirmation: ['required', 'string'],
  });

  const record = must(
    await db().from('password_reset_tokens').select('*').eq('email', validated.email).limit(1).maybeSingle(),
  ) as { email: string; token: string; created_at: string | null } | null;

  if (!record || !tokenMatches(validated.token, record.token)) {
    return json({ message: 'Lien de réinitialisation invalide ou expiré.' }, 400);
  }

  const createdAt = record.created_at ? new Date(record.created_at).getTime() : 0;
  if (createdAt + LINK_LIFETIME_MS < Date.now()) {
    must(await db().from('password_reset_tokens').delete().eq('email', validated.email));
    return json({ message: 'Le lien a expiré. Veuillez en demander un nouveau.' }, 400);
  }

  const user = must(
    await db().from('users').select('*').eq('email', validated.email).limit(1).maybeSingle(),
  ) as UserRow | null;

  if (!user) {
    return json({ message: 'Utilisateur introuvable.' }, 404);
  }

  const authId = await setUserPassword(user, validated.password);

  must(await db().from('password_reset_tokens').delete().eq('email', validated.email));

  await revokeAllSessions(authId);

  return json({
    message: 'Mot de passe réinitialisé avec succès.',
    user: authUserPayload(user),
  });
});
