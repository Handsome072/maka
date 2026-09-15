import { authenticate } from '@/server/auth';
import { input, intParam, json, notFound, route } from '@/server/http';
import {
  createMessage,
  findConversationOrFail,
  forbidden,
  isParticipant,
  touchConversation,
} from '@/server/messaging/conversations';
import {
  CONVERSATION_SELECT,
  MESSAGE_SELECT,
  formatConversations,
  formatMessage,
  type ConversationRecord,
  type MessageRecord,
} from '@/server/messaging/format';
import { db, fetchAll, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** ConversationController::messages */
export const GET = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Conversation');

  const conversation = must(
    await db().from('conversations').select(CONVERSATION_SELECT).eq('id', id).maybeSingle(),
  ) as ConversationRecord | null;
  if (!conversation) {
    notFound('Conversation', id);
  }

  // Ensure user is participant or admin
  if (!isParticipant(conversation, user.id) && user.role !== 'admin') {
    return forbidden();
  }

  const [messages, [formatted]] = await Promise.all([
    fetchAll<MessageRecord>(() =>
      db().from('messages').select(MESSAGE_SELECT).eq('conversation_id', id).order('created_at').order('id'),
    ),
    formatConversations([conversation], user.id),
  ]);

  return json({
    messages: messages.map(formatMessage),
    conversation: formatted,
  });
});

/** ConversationController::sendMessage */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Conversation');
  const data = await input(req);

  await validate(data, {
    text: 'required|string|max:5000',
  });

  const conversation = await findConversationOrFail(id);

  if (!isParticipant(conversation, user.id)) {
    return forbidden();
  }

  const message = await createMessage(
    { conversation_id: conversation.id, sender_id: user.id, text: data.text },
    user.role,
  );

  // Touch conversation to update ordering
  await touchConversation(conversation.id);

  return json(
    {
      message: 'Message envoyé',
      data: formatMessage(message),
    },
    201,
  );
});
