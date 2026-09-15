import { authenticate } from '@/server/auth';
import { input, json, route, toBoolean } from '@/server/http';
import { matchesReservationFilter, matchesSearch, queryValue } from '@/server/messaging/conversations';
import { CONVERSATION_SELECT, formatConversations, phpTruthy, type ConversationRecord } from '@/server/messaging/format';
import { db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** ConversationController::index */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);
  const data = await input(req);
  const role = queryValue(data, 'role', 'guest');
  const filter = queryValue(data, 'filter', 'all');
  const search = queryValue(data, 'search', null);
  const archived = toBoolean(data.archived, false);

  const [ownerColumn, archivedColumn] = role === 'host' ? ['host_id', 'host_archived'] : ['guest_id', 'guest_archived'];

  // Toutes les conversations du rôle ; le filtre de réservation et la recherche (OR entre relations)
  // sont appliqués ensuite sur les relations déjà chargées
  let conversations = await fetchAll<ConversationRecord>(() =>
    db()
      .from('conversations')
      .select(CONVERSATION_SELECT)
      .eq(ownerColumn, user.id)
      .eq(archivedColumn, archived)
      .order('updated_at', { ascending: false })
      .order('id', { ascending: false }),
  );

  if (filter !== 'all') {
    const now = Math.floor(Date.now() / 1000) * 1000;
    conversations = conversations.filter((conv) => matchesReservationFilter(conv, filter, now));
  }

  if (typeof search === 'string' && phpTruthy(search)) {
    conversations = conversations.filter((conv) => matchesSearch(conv, search, role));
  }

  const formatted = await formatConversations(conversations, user.id);

  return json({
    conversations: formatted,
    total: formatted.length,
  });
});
