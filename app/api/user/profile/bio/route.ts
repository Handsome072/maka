import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { formatUser } from '@/server/profile/format';
import { phpArray, updateUser } from '@/server/profile/update';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** UserProfileController::updateProfile */
export const PUT = route(async (req) => {
  const { user } = await authenticate(req);

  const validated = await validate(await input(req), {
    bio: ['nullable', 'string', 'max:500'],
    city: ['nullable', 'string', 'max:255'],
    profession: ['nullable', 'string', 'max:255'],
    languages_spoken: ['nullable', 'array'],
    'languages_spoken.*': ['string', 'max:50'],
    interests: ['nullable', 'array'],
    'interests.*': ['string', 'max:50'],
  });

  // Cast 'array' : json_encode d'un tableau PHP ({} → [], {"0": …} → liste)
  for (const key of ['languages_spoken', 'interests']) {
    if (key in validated) {
      validated[key] = phpArray(validated[key]);
    }
  }

  const fresh = await updateUser(user, validated);

  return json({
    message: 'Profil mis à jour.',
    user: formatUser(fresh),
  });
});
