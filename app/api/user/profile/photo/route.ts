import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { updateUser } from '@/server/profile/update';
import { imageValidationData, readImageInput, storeImage } from '@/server/profile/uploads';
import { deleteFiles, profilePhotoFullUrl } from '@/server/storage';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

const MAX_KILOBYTES = 5120;

/**
 * UserProfileController::uploadPhoto
 * `photo` : fichier multipart, ou référence « storage:tmp/<auth_id>/<fichier> » d'un envoi direct dans Supabase Storage.
 */
export const POST = route(async (req) => {
  const { user } = await authenticate(req);
  const data = await input(req);
  const options = { authId: user.auth_id, maxBytes: MAX_KILOBYTES * 1024 };

  const image = await readImageInput(data, 'photo', options);
  await validate(imageValidationData(data, 'photo', image), {
    photo: ['required', 'image', `max:${MAX_KILOBYTES}`],
  });

  const path = await storeImage(image, 'photo', { ...options, directory: 'profile-photos' });
  const previous = user.profile_photo_url;

  await updateUser(user, { profile_photo_url: `/storage/${path}` });

  // Ancienne photo supprimée une fois la nouvelle enregistrée (Laravel la supprimait avant l'envoi)
  if (previous) {
    await deleteFiles([previous.split('/storage/').join('')]);
  }

  return json({
    message: 'Photo de profil mise à jour.',
    profile_photo_url: profilePhotoFullUrl(`/storage/${path}`),
  });
});
