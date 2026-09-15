import { randomString } from '@/server/account';
import { verifyEmailMail } from '@/server/emails';
import { input, json, route } from '@/server/http';
import { frontendUrl, sendMail } from '@/server/mail';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** Inscription sans mot de passe : il sera défini après la vérification de l'email. */
export const POST = route(async (req) => {
  const validated = await validate<{
    first_name: string;
    last_name: string;
    email: string;
    birth_date?: string | null;
    receive_marketing?: boolean | number | string;
  }>(await input(req), {
    first_name: ['required', 'string', 'max:255'],
    last_name: ['required', 'string', 'max:255'],
    email: ['required', 'string', 'email', 'max:255', 'unique:users,email'],
    birth_date: ['nullable', 'date', 'before:today'],
    receive_marketing: ['boolean'],
  });

  const verificationToken = randomString(64);

  // Compte Supabase Auth sans mot de passe ; l'email est vérifié par notre propre lien, comme sous Laravel
  const { data: created, error: authError } = await db().auth.admin.createUser({
    email: validated.email,
    email_confirm: true,
  });
  if (authError || !created.user) {
    if ((authError as { code?: string } | null)?.code === 'email_exists') {
      return json(
        { message: 'The email has already been taken.', errors: { email: ['The email has already been taken.'] } },
        422,
      );
    }
    throw authError;
  }

  let user;
  try {
    user = must(
      await db()
        .from('users')
        .insert({
          auth_id: created.user.id,
          first_name: validated.first_name,
          last_name: validated.last_name,
          email: validated.email,
          has_password: false,
          birth_date: validated.birth_date ?? null,
          receive_marketing: [true, 1, '1'].includes(validated.receive_marketing as never),
          email_verification_token: verificationToken,
        })
        .select('*')
        .single(),
    );
  } catch (error) {
    await db().auth.admin.deleteUser(created.user.id);
    throw error;
  }

  const mail = verifyEmailMail(user.first_name, `${frontendUrl(req)}/verify-email?token=${verificationToken}`);
  await sendMail(user.email, mail.subject, mail.html);

  return json(
    {
      message: 'Inscription réussie. Veuillez vérifier votre email.',
      email: user.email,
    },
    201,
  );
});
