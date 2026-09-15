import { authenticate } from '@/server/auth';
import { input, json, notFound, route } from '@/server/http';
import { createMessage, touchConversation } from '@/server/messaging/conversations';
import { formatMessage } from '@/server/messaging/format';
import { freshTimestamp } from '@/server/profile/update';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** ConversationController::startConversation */
export const POST = route(async (req) => {
  const { user } = await authenticate(req);
  const data = await input(req);

  await validate(data, {
    listing_id: 'required|integer|exists:listings,id',
    message: 'required|string|max:5000',
  });

  const listing = must(
    await db().from('listings').select('id, user_id').eq('id', data.listing_id).maybeSingle(),
  ) as { id: number; user_id: number } | null;
  if (!listing) {
    notFound('Listing', data.listing_id);
  }
  const hostId = listing.user_id;

  if (hostId === user.id) {
    return json({ message: 'Vous ne pouvez pas vous envoyer un message à vous-même' }, 422);
  }

  // Find existing conversation between this guest and host for this listing
  let conversation = must(
    await db()
      .from('conversations')
      .select('id')
      .eq('listing_id', listing.id)
      .eq('host_id', hostId)
      .eq('guest_id', user.id)
      .order('id')
      .limit(1)
      .maybeSingle(),
  ) as { id: number } | null;

  if (!conversation) {
    const now = freshTimestamp();
    conversation = must(
      await db()
        .from('conversations')
        .insert({ listing_id: listing.id, host_id: hostId, guest_id: user.id, created_at: now, updated_at: now })
        .select('id')
        .single(),
    ) as { id: number };
  }

  const message = await createMessage(
    { conversation_id: conversation.id, sender_id: user.id, text: data.message },
    user.role,
  );

  await touchConversation(conversation.id);

  return json(
    {
      conversation_id: conversation.id,
      message: formatMessage(message),
    },
    201,
  );
});
