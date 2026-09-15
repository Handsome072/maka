import { authenticate } from '@/server/auth';
import { intParam, json, route } from '@/server/http';
import { findConversationOrFail, forbidden, isParticipant } from '@/server/messaging/conversations';
import { freshTimestamp } from '@/server/profile/update';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** ConversationController::markAsUnread */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const conversation = await findConversationOrFail(intParam(params.id, 'Conversation'));

  if (!isParticipant(conversation, user.id)) {
    return forbidden();
  }

  // Set the last message from the other participant back to unread (->latest() = created_at desc)
  const latest = must(
    await db()
      .from('messages')
      .select('id')
      .eq('conversation_id', conversation.id)
      .neq('sender_id', user.id)
      .not('read_at', 'is', null)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ) as { id: number } | null;

  if (latest) {
    must(await db().from('messages').update({ read_at: null, updated_at: freshTimestamp() }).eq('id', latest.id));
  }

  return json({ message: 'Conversation marquée comme non lue' });
});
