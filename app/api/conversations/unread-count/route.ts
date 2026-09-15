import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { queryValue } from '@/server/messaging/conversations';
import { chunk, db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** ConversationController::unreadCount */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);
  const role = queryValue(await input(req), 'role', 'guest');

  const conversationIds = (
    await fetchAll<{ id: number }>(() =>
      db()
        .from('conversations')
        .select('id')
        .eq(role === 'host' ? 'host_id' : 'guest_id', user.id)
        .order('id'),
    )
  ).map((row) => row.id);

  let count = 0;
  for (const ids of chunk(conversationIds)) {
    const { count: chunkCount, error } = await db()
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', ids)
      .neq('sender_id', user.id)
      .is('read_at', null);
    if (error) {
      throw error;
    }
    count += chunkCount ?? 0;
  }

  return json({ unread_count: count });
});
