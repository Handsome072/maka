import { hashToken, randomString } from '@/server/account';
import type { UserRow } from '@/server/auth';
import { resetPasswordMail } from '@/server/emails';
import { input, json, route } from '@/server/http';
import { frontendUrl, sendMail } from '@/server/mail';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

export const POST = route(async (req) => {
  const { email } = await validate<{ email: string }>(await input(req), {
    email: ['required', 'email'],
  });

  const user = must(await db().from('users').select('*').eq('email', email).limit(1).maybeSingle()) as UserRow | null;

  if (user) {
    const plainToken = randomString(64);

    // Un seul lien actif par email
    must(
      await db()
        .from('password_reset_tokens')
        .upsert(
          { email: user.email, token: hashToken(plainToken), created_at: new Date().toISOString() },
          { onConflict: 'email' },
        ),
    );

    const resetUrl =
      `${frontendUrl(req)}/reset-password?token=${encodeURIComponent(plainToken)}` +
      `&email=${encodeURIComponent(user.email)}`;
    const mail = resetPasswordMail(user.first_name, resetUrl);
    await sendMail(user.email, mail.subject, mail.html);
  }

  // Toujours la même réponse, pour ne pas révéler si l'email existe
  return json({
    message: 'Si cette adresse email existe, un lien de réinitialisation a été envoyé.',
  });
});
