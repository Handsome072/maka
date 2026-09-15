import { authUserPayload, setUserPassword } from '@/server/account';
import { hasVerifiedEmail, type UserRow } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/**
 * Définit le mot de passe après la vérification de l'email.
 * Le navigateur ouvre ensuite la session Supabase avec ce mot de passe (le jeton n'est plus émis ici).
 */
export const POST = route(async (req) => {
  const validated = await validate<{ token: string; password: string }>(await input(req), {
    token: ['required', 'string'],
    password: ['required', 'string', 'min:8', 'confirmed'],
  });

  const user = must(
    await db().from('users').select('*').eq('email_verification_token', `pwd_${validated.token}`).limit(1).maybeSingle(),
  ) as UserRow | null;

  if (!user) {
    return json({ message: 'Token invalide ou expiré. Veuillez vous réinscrire.' }, 400);
  }

  if (!hasVerifiedEmail(user)) {
    return json({ message: "Veuillez d'abord vérifier votre email." }, 400);
  }

  await setUserPassword(user, validated.password);
  must(await db().from('users').update({ email_verification_token: null }).eq('id', user.id));

  return json({
    message: 'Mot de passe créé avec succès.',
    user: authUserPayload(user, true),
  });
});
