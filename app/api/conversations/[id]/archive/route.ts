import { authenticate } from '@/server/auth';
import { intParam, json, route } from '@/server/http';
import { findConversationOrFail, forbidden, isParticipant, setArchived } from '@/server/messaging/conversations';

export const dynamic = 'force-dynamic';

/** ConversationController::archive */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const conversation = await findConversationOrFail(intParam(params.id, 'Conversation'));

  if (!isParticipant(conversation, user.id)) {
    return forbidden();
  }

  await setArchived(conversation, user.id, true);

  return json({ message: 'Conversation archivée' });
});
