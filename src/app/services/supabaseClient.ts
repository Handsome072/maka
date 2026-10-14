import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const UPLOADS_BUCKET = 'uploads';

let client: SupabaseClient | undefined;

/**
 * Les appels d'Auth (rafraîchissement du jeton surtout) partent sans délai maximal : sur une connexion
 * figée, getSession() attendait indéfiniment et toutes les pages connectées restaient sur leur spinner.
 * Passé ce délai, auth-js reçoit une erreur réseau et réessaie dans sa fenêtre de 30 s.
 * Les envois vers Storage gardent leur durée libre (grosses photos sur une connexion lente).
 */
const AUTH_TIMEOUT_MS = 10_000;

function fetchWithAuthTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  if (init?.signal || !url.includes('/auth/v1/')) {
    return fetch(input, init);
  }
  return fetch(input, { ...init, signal: AbortSignal.timeout(AUTH_TIMEOUT_MS) });
}

/**
 * Supabase client for the browser, with the publishable key.
 * Only used for the auth session and direct image uploads; all data goes through the app/api routes.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set');
    }
    client = createClient(url, key, {
      auth: {
        storageKey: 'homiqio_auth_session',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      global: { fetch: fetchWithAuthTimeout },
    });
  }
  return client;
}
