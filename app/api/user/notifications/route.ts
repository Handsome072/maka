import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { NOTIFICATION_PREFERENCE_KEYS } from '@/server/profile/format';
import { updateUser } from '@/server/profile/update';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** UserProfileController::updateNotifications */
export const PUT = route(async (req) => {
  const { user } = await authenticate(req);
  const data = await input(req);
  const preferences = data.notification_preferences;

  // PHP décode {} en tableau vide : la règle required échoue alors
  const isEmptyObject =
    preferences !== null &&
    typeof preferences === 'object' &&
    !Array.isArray(preferences) &&
    !(preferences instanceof Blob) &&
    Object.keys(preferences).length === 0;

  await validate(isEmptyObject ? { ...data, notification_preferences: [] } : data, {
    notification_preferences: ['required', 'array'],
    ...Object.fromEntries(NOTIFICATION_PREFERENCE_KEYS.map((key) => [`notification_preferences.${key}`, ['boolean']])),
  });

  // validated() ne garde que les sous-clés validées présentes (les autres clés du tableau sont écartées)
  const picked: Record<string, unknown> = {};
  if (preferences !== null && typeof preferences === 'object') {
    for (const key of NOTIFICATION_PREFERENCE_KEYS) {
      if (Object.prototype.hasOwnProperty.call(preferences, key)) {
        picked[key] = preferences[key];
      }
    }
  }

  const fresh = Object.keys(picked).length > 0 ? await updateUser(user, { notification_preferences: picked }) : user;

  return json({
    message: 'Préférences de notifications mises à jour.',
    notification_preferences: fresh.notification_preferences ?? null,
  });
});
