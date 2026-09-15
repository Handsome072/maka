import type { NextRequest } from 'next/server';
import { authenticateAdmin } from '@/server/auth';
import { input, intParam, json, notFound } from '@/server/http';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';
import { frDate, truthy } from './php';

/** Éléments communs à AdminHostController et AdminClientController. */

export type IdParams = { id: string };

/** User::findOrFail($id) (colonnes choisies). */
export async function findUser<T extends { id: number } = { id: number }>(id: number, columns = 'id'): Promise<T> {
  const row = must(await db().from('users').select(columns).eq('id', id).maybeSingle());
  if (!row) {
    notFound('User', id);
  }
  return row as unknown as T;
}

/** suspend / ban / activate : $user->update([$column => $value]) puis message. */
export async function updateStatus(
  req: NextRequest,
  params: IdParams,
  column: 'host_status' | 'client_status',
  value: string,
  message: string,
): Promise<Response> {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'User');
  const user = await findUser<{ id: number } & Record<string, unknown>>(id, `id,${column}`);
  // Eloquent n'exécute aucune requête si la valeur ne change pas (updated_at reste intact)
  if (user[column] !== value) {
    must(await db().from('users').update({ [column]: value }).eq('id', id));
  }
  return json({ message });
}

type NoteRow = { id: number; author: string; content: string; created_at: string | null };
type DocumentRow = { name: string; status: string; created_at: string | null };

export function formatNote(note: NoteRow) {
  return {
    id: note.id,
    author: note.author,
    date: frDate(note.created_at),
    content: note.content,
  };
}

export function formatDocument(doc: DocumentRow) {
  return {
    name: doc.name,
    date: frDate(doc.created_at),
    status: doc.status,
  };
}

/** $user->adminNotes et $user->hostDocuments (chargement eager, ordre de la clé primaire). */
export async function notesAndDocuments(userId: number): Promise<[NoteRow[], DocumentRow[]]> {
  const [notes, documents] = await Promise.all([
    db().from('admin_notes').select('id,author,content,created_at').eq('user_id', userId).order('id'),
    db().from('host_documents').select('id,name,status,created_at').eq('user_id', userId).order('id'),
  ]);
  return [must(notes) as NoteRow[], must(documents) as DocumentRow[]];
}

/** POST /note : validation, findOrFail, AdminNote::create. */
export async function addNote(req: NextRequest, params: IdParams, message: string): Promise<Response> {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'User');
  const data = await validate<{ content: string }>(await input(req), { content: 'required|string' });
  await findUser(id);

  const note = must(
    await db()
      .from('admin_notes')
      .insert({ user_id: id, author: 'Admin', content: data.content })
      .select('id,author,content,created_at')
      .single(),
  ) as NoteRow;

  return json({ message, note: formatNote(note) });
}

/** ->pluck('country')->filter()->unique()->values() */
export function uniqueTruthy(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (truthy(value) && !seen.has(value as string)) {
      seen.add(value as string);
      result.push(value as string);
    }
  }
  return result;
}

/** (int) $value */
export function phpInt(value: unknown): number {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? n : 0;
}
