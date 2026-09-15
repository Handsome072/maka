import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const UPLOADS_BUCKET = 'uploads';

let client: SupabaseClient | undefined;

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
    });
  }
  return client;
}
