import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { checkPassword, revokeAllSessions } from '@/server/profile/password';
import { updateUser } from '@/server/profile/update';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** UserProfileController::deactivateAccount */
export const POST = route(async (req) => {
  const { user, token } = await authenticate(req);

  const validated = await validate<{ password: string }>(await input(req), {
    reason: ['nullable', 'string', 'max:500'],
    password: ['required', 'string'],
  });

  if (!(await checkPassword(user, validated.password))) {
    return json({ message: 'Mot de passe incorrect.' }, 422);
  }

  // Revoke all tokens
  await revokeAllSessions(token);

  await updateUser(user, { role: 'deactivated' });

  return json({ message: 'Compte désactivé.' });
});
