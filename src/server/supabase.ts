import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Accès Supabase côté serveur (routes app/api uniquement).
 * Ne jamais importer ce fichier depuis un composant client : il utilise la clé secrète.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }
  return value;
}

const noSession = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
};

export function supabaseUrl(): string {
  return required('SUPABASE_URL', process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL).replace(/\/$/, '');
}

let adminClient: SupabaseClient | undefined;

/** Client avec la clé secrète : contourne la RLS, sert à toutes les lectures et écritures de l'API. */
export function db(): SupabaseClient {
  adminClient ??= createClient(
    supabaseUrl(),
    required('SUPABASE_SECRET_KEY', process.env.SUPABASE_SECRET_KEY),
    noSession,
  );
  return adminClient;
}

/** Client jetable avec la clé publique, pour vérifier un mot de passe sans créer de session partagée. */
export function publicAuthClient(): SupabaseClient {
  return createClient(
    supabaseUrl(),
    required(
      'SUPABASE_PUBLISHABLE_KEY',
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
    noSession,
  );
}

/** Renvoie les données d'une requête Supabase ou lève son erreur (équivalent d'une exception Eloquent). */
export function must<T>(result: { data: T; error: unknown }): T {
  if (result.error) {
    throw result.error;
  }
  return result.data;
}

/**
 * Récupère toutes les lignes d'une requête, par pages, au-delà de la limite de 1000 lignes de PostgREST
 * (équivalent de ->get() sans limite). La requête doit avoir un ordre stable.
 */
export async function fetchAll<T = any>(build: () => any, pageSize = 1000): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const page = must<T[]>(await build().range(from, from + pageSize - 1));
    rows.push(...page);
    if (page.length < pageSize) {
      return rows;
    }
  }
}

/** Découpe une liste d'identifiants pour les filtres .in() (longueur d'URL limitée). */
export function chunk<T>(items: T[], size = 200): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Valeur utilisable dans un filtre .or() de PostgREST, entre guillemets
 * (les virgules et parenthèses d'une recherche utilisateur casseraient sinon le filtre).
 */
export function orValue(value: string | number): string {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
