import { existingAccountMail, signupLinkMail } from '@/server/emails';
import { input, json, route } from '@/server/http';
import { frontendUrl, sendMail } from '@/server/mail';
import { createSignupToken, normalizeEmail } from '@/server/signup-token';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/**
 * Inscription, étape 1 : l'adresse e-mail seule. Rien n'est enregistré.
 * - adresse libre, ou inscription jamais terminée : lien signé vers /complete-signup, valable 24 heures ;
 * - compte déjà actif : mail « vous avez déjà un compte ».
 * La réponse est identique dans les deux cas, pour ne pas révéler quelles adresses ont un compte.
 */
export const POST = route(async (req) => {
  const validated = await validate<{ email: string }>(await input(req), {
    email: ['required', 'string', 'email', 'max:255'],
  });

  const email = normalizeEmail(validated.email);
  const site = frontendUrl(req);

  const existing = must(
    await db().from('users').select('email, has_password').eq('email', email).limit(1).maybeSingle(),
  ) as { email: string; has_password: boolean } | null;

  if (existing?.has_password) {
    const mail = existingAccountMail(
      existing.email,
      `${site}/login/`,
      `${site}/login/?forgot=1&email=${encodeURIComponent(existing.email)}`,
    );
    await sendMail(existing.email, mail.subject, mail.html);
  } else {
    const token = createSignupToken(email);
    const mail = signupLinkMail(email, `${site}/complete-signup/?token=${encodeURIComponent(token)}`);
    await sendMail(email, mail.subject, mail.html);
  }

  return json({
    message: 'Si cette adresse existe, un e-mail vient de lui être envoyé.',
    email,
  });
});
