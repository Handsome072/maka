import type { UserRow } from './auth';
import { HttpError } from './http';
import { readSignupToken } from './signup-token';
import { db, must } from './supabase';

/**
 * Lien d'inscription encore utilisable : son adresse, et la ligne users d'une inscription
 * commencée avec l'ancien parcours mais jamais terminée (compte sans mot de passe).
 * Lève une HttpError { status } si le lien est invalide, expiré ou a déjà servi.
 */
export async function usableSignupLink(token: unknown): Promise<{ email: string; unfinished: UserRow | null }> {
  const result = readSignupToken(token);

  if (result.status === 'invalid') {
    throw new HttpError(400, { status: 'invalid', message: "Ce lien d'inscription n'est pas valide." });
  }
  if (result.status === 'expired') {
    throw new HttpError(410, { status: 'expired', email: result.email, message: "Ce lien d'inscription a expiré." });
  }

  const user = must(
    await db().from('users').select('*').eq('email', result.email).limit(1).maybeSingle(),
  ) as UserRow | null;

  if (user?.has_password) {
    throw new HttpError(409, { status: 'used', email: result.email, message: 'Un compte existe déjà pour cette adresse.' });
  }

  return { email: result.email, unfinished: user };
}
