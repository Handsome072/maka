import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import { hasVerifiedEmail, type UserRow } from './auth';
import { HttpError } from './http';
import { db, must } from './supabase';

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** Str::random() */
export function randomString(length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHANUMERIC[randomInt(ALPHANUMERIC.length)];
  }
  return out;
}

/** Jeton de réinitialisation stocké haché (Laravel utilisait Hash::make). */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function tokenMatches(plain: string, storedHash: string): boolean {
  const a = Buffer.from(hashToken(plain));
  const b = Buffer.from(storedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Utilisateur renvoyé par login / set-password / reset-password dans AuthController. */
export function authUserPayload(user: UserRow, emailVerified = hasVerifiedEmail(user)) {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    email_verified: emailVerified,
  };
}

/**
 * Hash::make($password) : définit le mot de passe dans Supabase Auth (en créant le compte Auth s'il manque)
 * et marque la ligne users. Renvoie l'auth_id.
 */
export async function setUserPassword(user: UserRow, password: string): Promise<string> {
  let authId = user.auth_id;

  if (authId) {
    const { error } = await db().auth.admin.updateUserById(authId, { password });
    if (error) throw passwordError(error);
  } else {
    const { data, error } = await db().auth.admin.createUser({ email: user.email, password, email_confirm: true });
    if (error || !data.user) throw passwordError(error);
    authId = data.user.id;
  }

  must(await db().from('users').update({ auth_id: authId, has_password: true }).eq('id', user.id));
  return authId;
}

/** $user->tokens()->delete() */
export async function revokeAllSessions(authId: string | null): Promise<void> {
  if (!authId) return;
  must(await db().rpc('revoke_user_sessions', { p_auth_id: authId }));
}

function passwordError(error: unknown): Error {
  const message = error instanceof Error ? error.message : 'Mot de passe refusé.';
  const status = (error as { status?: number } | null)?.status;
  // Refus de Supabase Auth (mot de passe trop faible, etc.) : même forme qu'une erreur de validation
  if (status && status >= 400 && status < 500) {
    return new HttpError(422, { message, errors: { password: [message] } });
  }
  return error instanceof Error ? error : new Error(message);
}
