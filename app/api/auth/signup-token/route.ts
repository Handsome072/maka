import { input, json, route } from '@/server/http';
import { usableSignupLink } from '@/server/signup';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/**
 * Vérifie un lien d'inscription avant d'afficher le formulaire final.
 * 200 { status: 'valid', email } ; sinon 400 invalid, 410 expired ou 409 used.
 */
export const POST = route(async (req) => {
  const { token } = await validate<{ token: string }>(await input(req), {
    token: ['required', 'string'],
  });

  const { email } = await usableSignupLink(token);

  return json({ status: 'valid', email });
});
