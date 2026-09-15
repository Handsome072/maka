import { randomString } from '@/server/account';
import { authenticate, hasVerifiedEmail } from '@/server/auth';
import { verifyEmailMail } from '@/server/emails';
import { json, route } from '@/server/http';
import { frontendUrl, sendMail } from '@/server/mail';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

export const POST = route(async (req) => {
  const { user } = await authenticate(req);

  if (hasVerifiedEmail(user)) {
    return json({ message: 'Votre email est déjà vérifié.' }, 400);
  }

  const verificationToken = randomString(64);
  must(await db().from('users').update({ email_verification_token: verificationToken }).eq('id', user.id));

  const mail = verifyEmailMail(user.first_name, `${frontendUrl(req)}/verify-email?token=${verificationToken}`);
  await sendMail(user.email, mail.subject, mail.html);

  return json({ message: 'Email de vérification envoyé.' });
});
