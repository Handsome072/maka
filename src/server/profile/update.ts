import type { UserRow } from '@/server/auth';
import { ymd } from '@/server/format';
import { db, must } from '@/server/supabase';

/**
 * Carbon::now() tel qu'Eloquent l'écrit en base ('Y-m-d H:i:s', donc tronqué à la seconde).
 * Postgres arrondirait sinon les millisecondes d'un timestamptz(0) à la seconde supérieure.
 */
export function freshTimestamp(): string {
  return new Date(Math.floor(Date.now() / 1000) * 1000).toISOString();
}

/**
 * Tableau PHP issu d'un json_decode : un objet vide devient [] et un objet aux clés "0".."n-1"
 * devient une liste, comme le ferait json_encode lors de l'écriture d'une colonne castée 'array'.
 */
export function phpArray(value: unknown): unknown {
  if (value === null || typeof value !== 'object' || Array.isArray(value) || value instanceof Blob) {
    return value;
  }
  const keys = Object.keys(value);
  if (keys.every((key, index) => key === String(index))) {
    return keys.map((key) => (value as Record<string, unknown>)[key]);
  }
  return value;
}

const DATE_COLUMNS = new Set(['birth_date']);

/** Cast 'date' à l'écriture : Carbon garde la date « murale » d'une chaîne avec heure et fuseau. */
function dateColumnValue(value: unknown): unknown {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const text = String(value);
  const prefix = text.match(/^(\d{4}-\d{2}-\d{2})/);
  if (prefix) {
    return prefix[1];
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? text : ymd(parsed);
}

function isEquivalent(key: string, current: unknown, next: unknown): boolean {
  if ((current === null || current === undefined) && (next === null || next === undefined)) {
    return true;
  }
  if (DATE_COLUMNS.has(key)) {
    return typeof current === 'string' && ymd(current) === next;
  }
  if ((current !== null && typeof current === 'object') || (next !== null && typeof next === 'object')) {
    return JSON.stringify(current) === JSON.stringify(next);
  }
  return current === next;
}

/**
 * $user->update($attributes) puis $user->fresh() : seules les colonnes modifiées sont écrites
 * (aucune requête, et updated_at inchangé, si rien n'a changé), puis la ligne relue est renvoyée.
 */
export async function updateUser(user: UserRow, attributes: Record<string, unknown>): Promise<UserRow> {
  const dirty: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(attributes)) {
    if (raw === undefined) {
      continue;
    }
    const value = DATE_COLUMNS.has(key) ? dateColumnValue(raw) : raw;
    if (!isEquivalent(key, user[key], value)) {
      dirty[key] = value;
    }
  }

  if (Object.keys(dirty).length === 0) {
    return user;
  }

  return must(
    await db()
      .from('users')
      .update({ ...dirty, updated_at: freshTimestamp() })
      .eq('id', user.id)
      .select('*')
      .single(),
  ) as UserRow;
}
