import type { NextRequest } from 'next/server';
import { authenticateAdmin } from '@/server/auth';
import { input, intParam, json } from '@/server/http';
import { iso8601 } from '@/server/format';
import { storageUrl } from '@/server/storage';
import { db, fetchAll, must } from '@/server/supabase';
import { validate } from '@/server/validation';
import { personName, truthy } from './php';
import { findUser, type IdParams } from './users';

/** AdminClientController::getMessages / sendAdminMessage (conversation admin : host_id = admin, guest_id = client). */

type MessageRow = {
  id: number;
  conversation_id: number;
  sender_id: number;
  text: string | null;
  image_path: string | null;
  read_at: string | null;
  created_at: string | null;
  sender: { id: number; first_name: string | null; last_name: string | null; role: string | null } | null;
};

/** ->toIso8601String() sur une date obligatoire (null → erreur 500 comme en PHP). */
function requiredIso8601(value: string | null): string {
  if (value === null) {
    throw new Error('admin-users: created_at null sur un message');
  }
  return iso8601(value) as string;
}

/** Conversation::where(host_id, guest_id, is_admin_conversation = true)->first() */
async function findAdminConversation(adminId: number, clientId: number): Promise<{ id: number } | null> {
  return must(
    await db()
      .from('conversations')
      .select('id')
      .eq('host_id', adminId)
      .eq('guest_id', clientId)
      .eq('is_admin_conversation', true)
      .order('id')
      .limit(1)
      .maybeSingle(),
  ) as { id: number } | null;
}

// ─── GET /api/admin/clients/{id}/messages ─────────────────────────────────────

export async function getMessages(req: NextRequest, params: IdParams): Promise<Response> {
  const { user: admin } = await authenticateAdmin(req);
  const id = intParam(params.id, 'User');
  const client = await findUser(id);

  const conversation = await findAdminConversation(admin.id, client.id);
  if (!conversation) {
    return json({
      conversation_id: null,
      messages: [],
      is_admin_conversation: true,
    });
  }

  // $conversation->messages() : orderBy('created_at') (NULL en premier comme MySQL), id en départage
  const messages = await fetchAll<MessageRow>(() =>
    db()
      .from('messages')
      .select('id,conversation_id,sender_id,text,image_path,read_at,created_at,sender:users!messages_sender_id_fkey(id,first_name,last_name,role)')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true, nullsFirst: true })
      .order('id', { ascending: true }),
  );

  return json({
    conversation_id: conversation.id,
    messages: messages.map((msg) => ({
      id: msg.id,
      conversation_id: msg.conversation_id,
      sender_id: msg.sender_id,
      sender_role: msg.sender?.role ?? 'user',
      sender_name: personName(msg.sender?.first_name, msg.sender?.last_name),
      text: msg.text,
      image_url: truthy(msg.image_path) ? storageUrl(msg.image_path as string) : null,
      read_at: iso8601(msg.read_at),
      created_at: requiredIso8601(msg.created_at),
    })),
    is_admin_conversation: true,
  });
}

// ─── POST /api/admin/clients/{id}/messages ────────────────────────────────────

export async function sendAdminMessage(req: NextRequest, params: IdParams): Promise<Response> {
  const { user: admin } = await authenticateAdmin(req);
  const id = intParam(params.id, 'User');
  const client = await findUser(id);

  const data = await validate<{ text: string }>(await input(req), {
    text: 'required|string|max:5000',
  });

  // Conversation::firstOrCreate([...], ['reservation_id' => null, 'listing_id' => null])
  let conversation = await findAdminConversation(admin.id, client.id);
  if (!conversation) {
    conversation = must(
      await db()
        .from('conversations')
        .insert({
          host_id: admin.id,
          guest_id: client.id,
          is_admin_conversation: true,
          reservation_id: null,
          listing_id: null,
        })
        .select('id')
        .single(),
    ) as { id: number };
  }

  const message = must(
    await db()
      .from('messages')
      .insert({ conversation_id: conversation.id, sender_id: admin.id, text: data.text })
      .select('id,conversation_id,sender_id,text,created_at')
      .single(),
  ) as Pick<MessageRow, 'id' | 'conversation_id' | 'sender_id' | 'text' | 'created_at'>;

  // $conversation->touch()
  const touchedAt = new Date(Math.floor(Date.now() / 1000) * 1000).toISOString();
  must(await db().from('conversations').update({ updated_at: touchedAt }).eq('id', conversation.id));

  return json(
    {
      message: 'Message envoye',
      data: {
        id: message.id,
        conversation_id: message.conversation_id,
        sender_id: message.sender_id,
        sender_role: 'admin',
        sender_name: 'Admin Séjoura',
        text: message.text,
        image_url: null,
        read_at: null,
        created_at: requiredIso8601(message.created_at),
      },
      conversation_id: conversation.id,
    },
    201,
  );
}
