import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { formatUser } from '@/server/profile/format';
import { updateUser } from '@/server/profile/update';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** UserProfileController::updatePreferences */
export const PUT = route(async (req) => {
  const { user } = await authenticate(req);

  const validated = await validate(await input(req), {
    preferred_language: ['sometimes', 'string', 'max:5'],
    preferred_currency: ['sometimes', 'string', 'max:5'],
    timezone: ['sometimes', 'string', 'max:50'],
  });

  const fresh = await updateUser(user, validated);

  return json({
    message: 'Préférences mises à jour.',
    user: formatUser(fresh),
  });
});
