import { authenticate } from '@/server/auth';
import { input, intParam, json, route } from '@/server/http';
import {
  createMessage,
  findConversationOrFail,
  forbidden,
  isParticipant,
  touchConversation,
} from '@/server/messaging/conversations';
import { formatMessage } from '@/server/messaging/format';
import { imageValidationData, readImageInput, storeImage } from '@/server/profile/uploads';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

const MAX_KILOBYTES = 10240;

/**
 * ConversationController::sendImage
 * `image` : fichier multipart, ou référence « storage:tmp/<auth_id>/<fichier> » d'un envoi direct dans Supabase Storage
 * (vérifiée pendant la validation, déplacée seulement après le contrôle d'accès).
 */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Conversation');
  const data = await input(req);
  const options = { authId: user.auth_id, maxBytes: MAX_KILOBYTES * 1024 };

  const image = await readImageInput(data, 'image', options);
  await validate(imageValidationData(data, 'image', image), {
    image: `required|image|max:${MAX_KILOBYTES}`,
    text: 'nullable|string|max:5000',
  });

  const conversation = await findConversationOrFail(id);

  if (!isParticipant(conversation, user.id)) {
    return forbidden();
  }

  const path = await storeImage(image, 'image', { ...options, directory: `conversations/${conversation.id}` });

  const message = await createMessage(
    { conversation_id: conversation.id, sender_id: user.id, text: data.text ?? null, image_path: path },
    user.role,
  );

  await touchConversation(conversation.id);

  return json(
    {
      message: 'Image envoyée',
      data: formatMessage(message),
    },
    201,
  );
});
