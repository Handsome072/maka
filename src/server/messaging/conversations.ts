import { json, notFound } from '@/server/http';
import { freshTimestamp } from '@/server/profile/update';
import { db, must } from '@/server/supabase';
import { MESSAGE_COLUMNS, type ConversationRecord, type MessageRecord } from './format';

export type ConversationBase = {
  id: number;
  host_id: number;
  guest_id: number;
  host_archived: boolean;
  guest_archived: boolean;
  updated_at: string;
};

const BASE_COLUMNS = 'id, host_id, guest_id, host_archived, guest_archived, updated_at';

/** Conversation::findOrFail($id) */
export async function findConversationOrFail(id: number): Promise<ConversationBase> {
  const conversation = must(await db().from('conversations').select(BASE_COLUMNS).eq('id', id).maybeSingle());
  if (!conversation) {
    notFound('Conversation', id);
  }
  return conversation as ConversationBase;
}

export function isParticipant(conversation: Pick<ConversationBase, 'host_id' | 'guest_id'>, userId: number): boolean {
  return conversation.host_id === userId || conversation.guest_id === userId;
}

export function forbidden(): Response {
  return json({ message: 'Non autorisé' }, 403);
}

/** $conversation->touch() : pas de requête si updated_at vaut déjà l'horodatage courant. */
export async function touchConversation(id: number): Promise<void> {
  const now = freshTimestamp();
  must(await db().from('conversations').update({ updated_at: now }).eq('id', id).neq('updated_at', now));
}

/**
 * $conversation->update(['host_archived' => …]) ou guest_archived selon le rôle de l'utilisateur.
 * Comme Eloquent, aucune écriture (ni updated_at, qui ordonne la liste) si la valeur ne change pas.
 */
export async function setArchived(conversation: ConversationBase, userId: number, archived: boolean): Promise<void> {
  const column = conversation.host_id === userId ? 'host_archived' : 'guest_archived';
  if (conversation[column] === archived) {
    return;
  }
  must(
    await db()
      .from('conversations')
      .update({ [column]: archived, updated_at: freshTimestamp() })
      .eq('id', conversation.id),
  );
}

/** Message::create([...]) ; le rôle de l'expéditeur sert à formatMessage (c'est l'utilisateur courant). */
export async function createMessage(
  attributes: { conversation_id: number; sender_id: number; text: string | null; image_path?: string },
  senderRole: string,
): Promise<MessageRecord> {
  const now = freshTimestamp();
  const row = must(
    await db()
      .from('messages')
      .insert({ ...attributes, created_at: now, updated_at: now })
      .select(MESSAGE_COLUMNS)
      .single(),
  ) as MessageRecord;
  return { ...row, sender: { role: senderRole } };
}

/** $request->query($key, $default) : clé présente mais vide → null (ConvertEmptyStringsToNull). */
export function queryValue(data: Record<string, any>, key: string, fallback: string | null): unknown {
  return key in data ? data[key] : fallback;
}

// ─── Filtres de ConversationController::index ────────────────────────────────

/** Minuit UTC d'une colonne DATE, comme MySQL la compare à un DATETIME. */
function dateAsDatetime(value: string): number {
  return Date.parse(`${value.slice(0, 10)}T00:00:00Z`);
}

/** whereHas('reservation', match ($filter) …) ; `now` = now() tronqué à la seconde. */
export function matchesReservationFilter(conv: ConversationRecord, filter: unknown, now: number): boolean {
  const reservation = conv.reservation;
  if (!reservation) {
    return false;
  }
  const status = reservation.status;
  switch (filter) {
    case 'pending':
      return status === 'pending';
    case 'upcoming':
      return status === 'confirmed' && dateAsDatetime(reservation.check_in) > now;
    case 'active':
      return (
        (status === 'confirmed' || status === 'active') &&
        dateAsDatetime(reservation.check_in) <= now &&
        dateAsDatetime(reservation.check_out) >= now
      );
    case 'past':
      return (
        status === 'completed' ||
        ((status === 'confirmed' || status === 'active') && dateAsDatetime(reservation.check_out) < now)
      );
    default:
      return true;
  }
}

/** Repli insensible à la casse et aux accents (approximation de utf8mb4_unicode_ci). */
function fold(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** `$column like "%{$search}%"` de MySQL (% et _ jokers, \ échappe). */
export function likeContains(value: string | null | undefined, search: string): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  const pattern = fold(`%${search}%`);
  let regex = '';
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    if (char === '\\' && i + 1 < pattern.length) {
      i++;
      regex += pattern[i].replace(/[.*+?^${}()|[\]\\\/-]/g, '\\$&');
    } else if (char === '%') {
      regex += '[\\s\\S]*';
    } else if (char === '_') {
      regex += '[\\s\\S]';
    } else {
      regex += char.replace(/[.*+?^${}()|[\]\\\/-]/g, '\\$&');
    }
  }
  return new RegExp(`^${regex}$`).test(fold(value));
}

/** Recherche sur le nom de l'autre participant OU le titre de l'annonce de la réservation. */
export function matchesSearch(conv: ConversationRecord, search: string, role: unknown): boolean {
  const other = role === 'host' ? conv.guest : conv.host;
  const nameMatches = !!other && (likeContains(other.first_name, search) || likeContains(other.last_name, search));
  const titleMatches = !!conv.reservation?.listing && likeContains(conv.reservation.listing.title, search);
  return nameMatches || titleMatches;
}
