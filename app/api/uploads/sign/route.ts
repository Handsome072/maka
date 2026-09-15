import { authenticate } from '@/server/auth';
import { abort, input, json, route } from '@/server/http';
import { createSignedUpload, IMAGE_MIME_TYPES } from '@/server/storage';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Autorise le navigateur à envoyer une image directement dans Supabase Storage (dossier tmp/ de l'utilisateur).
 * Vercel limitant le corps des requêtes à 4,5 Mo, les photos ne transitent plus par les routes API :
 * celles-ci reçoivent la référence renvoyée ici et déplacent le fichier à son emplacement définitif.
 */
export const POST = route(async (req) => {
  const { user } = await authenticate(req);

  const { content_type } = await validate<{ content_type: string; size: number }>(await input(req), {
    content_type: ['required', 'string', `in:${IMAGE_MIME_TYPES.join(',')}`],
    size: ['required', 'integer', 'min:1', `max:${MAX_UPLOAD_BYTES}`],
  });

  if (!user.auth_id) {
    abort(401, 'Unauthenticated.');
  }

  return json(await createSignedUpload(user.auth_id, content_type));
});
