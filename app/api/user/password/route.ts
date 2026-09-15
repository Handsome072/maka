import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { checkPassword, setPassword } from '@/server/profile/password';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** UserProfileController::updatePassword */
export const PUT = route(async (req) => {
  const { user, token } = await authenticate(req);

  const validated = await validate<{ current_password: string; password: string }>(await input(req), {
    current_password: ['required', 'string'],
    // Password::min(8) relance « string » puis « min:8 » dans un validateur interne : d'où le second 'string'
    password: ['required', 'string', 'string', 'min:8', 'confirmed'],
  });

  if (!(await checkPassword(user, validated.current_password))) {
    return json({ message: 'Le mot de passe actuel est incorrect.' }, 422);
  }

  // Le jeton courant garde cette session ouverte après le changement, comme sous Laravel
  await setPassword(user, validated.password, token);

  return json({ message: 'Mot de passe mis à jour.' });
});
