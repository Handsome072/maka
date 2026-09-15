import type { NextRequest } from 'next/server';
import { HttpError } from './http';
import { db, must } from './supabase';

/** Ligne de public.users (colonnes du modèle User de Laravel, sans le mot de passe). */
export type UserRow = {
  id: number;
  auth_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  has_password: boolean;
  email_verified_at: string | null;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;
  [column: string]: any;
};

export type Authenticated = {
  user: UserRow;
  /** Jeton d'accès Supabase de la requête (sert à révoquer la session). */
  token: string;
};

function bearerToken(req: NextRequest): string | null {
  const match = (req.headers.get('authorization') ?? '').match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/** Middleware auth:sanctum : jeton Supabase valide (session non révoquée) relié à un utilisateur. */
export async function authenticate(req: NextRequest): Promise<Authenticated> {
  const token = bearerToken(req);
  if (!token) {
    throw new HttpError(401, { message: 'Unauthenticated.' });
  }

  // getUser interroge Supabase Auth : une session déconnectée est refusée immédiatement, comme un jeton Sanctum supprimé
  const { data, error } = await db().auth.getUser(token);
  if (error || !data.user) {
    throw new HttpError(401, { message: 'Unauthenticated.' });
  }

  const user = must(await db().from('users').select('*').eq('auth_id', data.user.id).maybeSingle()) as UserRow | null;
  if (!user) {
    throw new HttpError(401, { message: 'Unauthenticated.' });
  }

  return { user, token };
}

/** auth:sanctum + middleware admin */
export async function authenticateAdmin(req: NextRequest): Promise<Authenticated> {
  const auth = await authenticate(req);
  if (auth.user.role !== 'admin') {
    throw new HttpError(403, { message: 'Accès interdit.' });
  }
  return auth;
}

/** $user->hasVerifiedEmail() */
export function hasVerifiedEmail(user: Pick<UserRow, 'email_verified_at'>): boolean {
  return user.email_verified_at !== null && user.email_verified_at !== undefined;
}

/** $user->name */
export function fullName(user: Pick<UserRow, 'first_name' | 'last_name'>): string {
  return `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
}
