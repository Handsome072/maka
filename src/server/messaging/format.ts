import { iso8601 } from '@/server/format';
import { chunk, db, fetchAll, must } from '@/server/supabase';
import { profilePhotoFullUrl, storageUrl } from '@/server/storage';

/** (bool) / if ($value) de PHP pour une chaîne : "" et "0" sont faux. */
export function phpTruthy(value: unknown): boolean {
  return value !== null && value !== undefined && value !== false && value !== 0 && value !== '' && value !== '0';
}

// ─── Messages ────────────────────────────────────────────────────────────────

export type MessageRecord = {
  id: number;
  conversation_id: number;
  sender_id: number;
  text: string | null;
  image_path: string | null;
  read_at: string | null;
  created_at: string;
  /** sender:id,first_name,last_name,role */
  sender?: { role: string | null } | null;
};

export const MESSAGE_COLUMNS = 'id, conversation_id, sender_id, text, image_path, read_at, created_at';

/** Colonnes d'un message avec le rôle de l'expéditeur (loadMissing('sender')). */
export const MESSAGE_SELECT = `${MESSAGE_COLUMNS}, sender:users!messages_sender_id_fkey(role)`;

/** $message->image_url */
export function messageImageUrl(imagePath: string | null | undefined): string | null {
  return phpTruthy(imagePath) ? storageUrl(imagePath as string) : null;
}

/** ConversationController::formatMessage */
export function formatMessage(msg: MessageRecord) {
  return {
    id: msg.id,
    conversation_id: msg.conversation_id,
    sender_id: msg.sender_id,
    sender_role: msg.sender?.role ?? 'user',
    text: msg.text,
    image_url: messageImageUrl(msg.image_path),
    read_at: iso8601(msg.read_at),
    created_at: iso8601(msg.created_at),
  };
}

// ─── Conversations ───────────────────────────────────────────────────────────

type ListingRef = { id: number; title: string | null };
type Participant = { id: number; first_name: string; last_name: string; profile_photo_url: string | null };

export type ConversationRecord = {
  id: number;
  reservation_id: number | null;
  listing_id: number | null;
  host_id: number;
  guest_id: number;
  host_archived: boolean;
  guest_archived: boolean;
  is_admin_conversation: boolean;
  created_at: string;
  updated_at: string;
  reservation: {
    id: number;
    check_in: string;
    check_out: string;
    guests_count: number;
    status: string;
    listing: ListingRef | null;
  } | null;
  listing: ListingRef | null;
  host: Participant | null;
  guest: Participant | null;
};

/**
 * Conversation::with(['reservation.listing', 'listing', 'host:…', 'guest:…']).
 * Les photos, le dernier message et le nombre de non-lus sont chargés par lot dans formatConversations.
 */
export const CONVERSATION_SELECT = [
  'id, reservation_id, listing_id, host_id, guest_id, host_archived, guest_archived, is_admin_conversation, created_at, updated_at',
  'reservation:reservations!conversations_reservation_id_fkey(id, check_in, check_out, guests_count, status, listing:listings!reservations_listing_id_fkey(id, title))',
  'listing:listings!conversations_listing_id_fkey(id, title)',
  'host:users!conversations_host_id_fkey(id, first_name, last_name, profile_photo_url)',
  'guest:users!conversations_guest_id_fkey(id, first_name, last_name, profile_photo_url)',
].join(', ');

type LastMessage = { id: number; text: string | null; sender_id: number; created_at: string; image_path: string | null };

export type ConversationExtras = {
  /** $listing->photos->first()->path */
  firstPhotoPath: string | null;
  unreadCount: number;
  /** $conv->lastMessage (latestOfMany : id le plus élevé) */
  lastMessage: LastMessage | null;
};

function participant(user: Participant | null) {
  return {
    id: user?.id ?? null,
    first_name: user?.first_name ?? null,
    last_name: user?.last_name ?? null,
    profile_photo_url: profilePhotoFullUrl(user?.profile_photo_url),
  };
}

/** ConversationController::formatConversation */
export function formatConversation(conv: ConversationRecord, currentUserId: number, extras: ConversationExtras) {
  const reservation = conv.reservation;
  const listing = reservation?.listing ?? conv.listing;
  const path = extras.firstPhotoPath;
  const photoUrl = path !== null ? (path.startsWith('http') ? path : storageUrl(path)) : null;
  const listingData = listing ? { id: listing.id, title: listing.title, photo_url: photoUrl } : null;
  const last = extras.lastMessage;

  return {
    id: conv.id,
    reservation: reservation
      ? {
          id: reservation.id,
          check_in: reservation.check_in,
          check_out: reservation.check_out,
          guests_count: reservation.guests_count,
          status: reservation.status,
          listing: listingData,
        }
      : null,
    listing: listingData,
    host: participant(conv.host),
    guest: participant(conv.guest),
    last_message: last
      ? {
          text: last.text,
          sender_id: last.sender_id,
          created_at: iso8601(last.created_at),
          has_image: phpTruthy(last.image_path),
        }
      : null,
    unread_count: extras.unreadCount,
    is_archived: conv.host_id === currentUserId ? conv.host_archived : conv.guest_archived,
    is_admin_conversation: Boolean(conv.is_admin_conversation),
    created_at: iso8601(conv.created_at),
    updated_at: iso8601(conv.updated_at),
  };
}

/** Charge par lot la première photo, le dernier message et les non-lus de chaque conversation. */
export async function loadConversationExtras(
  convs: ConversationRecord[],
  currentUserId: number,
): Promise<Map<number, ConversationExtras>> {
  const ids = [...new Set(convs.map((conv) => conv.id))];
  const listingIds = [
    ...new Set(
      convs
        .map((conv) => (conv.reservation?.listing ?? conv.listing)?.id)
        .filter((id): id is number => id !== undefined && id !== null),
    ),
  ];

  const firstPhotos = new Map<number, string>();
  const unread = new Map<number, number>();
  const lastMessages = new Map<number, LastMessage>();

  const loadPhotos = async () => {
    for (const ids of chunk(listingIds)) {
      const photos = await fetchAll<{ listing_id: number; path: string }>(() =>
        db()
          .from('listing_photos')
          .select('id, listing_id, path, order')
          .in('listing_id', ids)
          .order('listing_id')
          .order('order')
          .order('id'),
      );
      for (const photo of photos) {
        if (!firstPhotos.has(photo.listing_id)) {
          firstPhotos.set(photo.listing_id, photo.path);
        }
      }
    }
  };

  const loadUnread = async () => {
    for (const convIds of chunk(ids)) {
      const rows = await fetchAll<{ conversation_id: number }>(() =>
        db()
          .from('messages')
          .select('id, conversation_id')
          .in('conversation_id', convIds)
          .neq('sender_id', currentUserId)
          .is('read_at', null)
          .order('id'),
      );
      for (const row of rows) {
        unread.set(row.conversation_id, (unread.get(row.conversation_id) ?? 0) + 1);
      }
    }
  };

  const loadLastMessages = async () => {
    for (const convIds of chunk(ids)) {
      const rows = must(
        await db()
          .from('conversations')
          .select('id, messages!messages_conversation_id_fkey(id, text, sender_id, created_at, image_path)')
          .in('id', convIds)
          .order('id', { referencedTable: 'messages', ascending: false })
          .limit(1, { referencedTable: 'messages' }),
      ) as Array<{ id: number; messages: LastMessage[] | null }>;
      for (const row of rows) {
        const last = row.messages?.[0];
        if (last) {
          lastMessages.set(row.id, last);
        }
      }
    }
  };

  await Promise.all([loadPhotos(), loadUnread(), loadLastMessages()]);

  const extras = new Map<number, ConversationExtras>();
  for (const conv of convs) {
    const listingId = (conv.reservation?.listing ?? conv.listing)?.id;
    extras.set(conv.id, {
      firstPhotoPath: listingId !== undefined && listingId !== null ? firstPhotos.get(listingId) ?? null : null,
      unreadCount: unread.get(conv.id) ?? 0,
      lastMessage: lastMessages.get(conv.id) ?? null,
    });
  }
  return extras;
}

/** $conversations->map(fn ($conv) => $this->formatConversation($conv, $userId)), sans N+1. */
export async function formatConversations(convs: ConversationRecord[], currentUserId: number) {
  if (convs.length === 0) {
    return [];
  }
  const extras = await loadConversationExtras(convs, currentUserId);
  return convs.map((conv) => formatConversation(conv, currentUserId, extras.get(conv.id)!));
}
