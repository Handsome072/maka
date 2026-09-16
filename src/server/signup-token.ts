import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Jeton du lien d'inscription : adresse e-mail et date d'expiration signées (HMAC-SHA256).
 * Rien n'est enregistré avant la fin de l'inscription ; le lien ne crée qu'un seul compte
 * puisque l'adresse est prise dès que ce compte existe.
 */

export const SIGNUP_LINK_LIFETIME_MS = 24 * 60 * 60 * 1000;

type Payload = { v: 1; email: string; exp: number };

export type SignupTokenResult =
  | { status: 'valid'; email: string }
  | { status: 'expired'; email: string }
  | { status: 'invalid' };

function signingKey(): Buffer {
  const secret = process.env.SIGNUP_TOKEN_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!secret) {
    throw new Error("Variable d'environnement manquante : SIGNUP_TOKEN_SECRET ou SUPABASE_SECRET_KEY");
  }
  // Clé dérivée : la clé secrète n'est jamais utilisée telle quelle pour signer
  return createHmac('sha256', secret).update('sejoura-signup-link-v1').digest();
}

function sign(encodedPayload: string): string {
  return createHmac('sha256', signingKey()).update(encodedPayload).digest('base64url');
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function createSignupToken(email: string, now = Date.now()): string {
  const payload: Payload = { v: 1, email: normalizeEmail(email), exp: now + SIGNUP_LINK_LIFETIME_MS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function readSignupToken(token: unknown, now = Date.now()): SignupTokenResult {
  if (typeof token !== 'string') return { status: 'invalid' };

  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { status: 'invalid' };
  const [encoded, signature] = parts;

  const expected = Buffer.from(sign(encoded));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return { status: 'invalid' };
  }

  let payload: Payload;
  try {
    payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    return { status: 'invalid' };
  }
  if (!payload || payload.v !== 1 || typeof payload.email !== 'string' || typeof payload.exp !== 'number') {
    return { status: 'invalid' };
  }

  if (payload.exp <= now) return { status: 'expired', email: payload.email };
  return { status: 'valid', email: payload.email };
}
