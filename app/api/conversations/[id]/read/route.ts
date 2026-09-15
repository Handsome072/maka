import { authenticate } from '@/server/auth';
import { intParam, json, route } from '@/server/http';
import { findConversationOrFail, forbidden, isParticipant } from '@/server/messaging/conversations';
import { freshTimestamp } from '@/server/profile/update';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** ConversationController::markAsRead */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const conversation = await findConversationOrFail(intParam(params.id, 'Conversation'));

  if (!isParticipant(conversation, user.id)) {
    return forbidden();
  }

  // Mark all unread messages from the other participant as read
  const now = freshTimestamp();
  must(
    await db()
      .from('messages')
      .update({ read_at: now, updated_at: now })
      .eq('conversation_id', conversation.id)
      .neq('sender_id', user.id)
      .is('read_at', null),
  );

  return json({ message: 'Conversation marquée comme lue' });
});
