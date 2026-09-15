#!/usr/bin/env node
/**
 * Import des données de l'ancienne base MySQL (api-homiqio) vers Supabase :
 * tables public.*, comptes Supabase Auth (les mots de passe bcrypt sont conservés) et fichiers stockés.
 *
 * Variables d'environnement :
 *   MYSQL_HOST (127.0.0.1)  MYSQL_PORT (3307)  MYSQL_USER  MYSQL_PASSWORD  MYSQL_DATABASE (homiqio)
 *   SUPABASE_DB_URL         chaîne de connexion Postgres (pooler de session, port 5432)
 *   SUPABASE_URL  SUPABASE_SECRET_KEY
 *   STORAGE_DIR             dossier storage/app/public de Laravel (facultatif : fichiers non copiés sinon)
 *
 * Usage : node supabase/scripts/import-mysql.mjs [--reset]
 *   --reset  vide d'abord les tables et supprime les comptes Auth des utilisateurs importés
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

// Ordre d'insertion compatible avec les clés étrangères
const TABLES = [
  'users',
  'password_reset_tokens',
  'listings',
  'listing_photos',
  'reservations',
  'conversations',
  'messages',
  'host_payouts',
  'reviews',
  'guest_reviews',
  'admin_notes',
  'host_documents',
  'client_reports',
  'activity_logs',
];

// Colonnes MySQL volontairement non reprises (le mot de passe vit dans Supabase Auth)
const DROPPED_COLUMNS = { users: ['password', 'remember_token'] };

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
};

const reset = process.argv.includes('--reset');

function env(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }
  return value;
}

const log = (...args) => console.log('[import]', ...args);

const my = await mysql.createConnection({
  host: env('MYSQL_HOST', '127.0.0.1'),
  port: Number(env('MYSQL_PORT', '3307')),
  user: env('MYSQL_USER'),
  password: env('MYSQL_PASSWORD'),
  database: env('MYSQL_DATABASE', 'homiqio'),
  // Valeurs brutes : dates en texte, JSON en texte, décimaux en texte (aucune conversion implicite)
  dateStrings: true,
  jsonStrings: true,
  decimalNumbers: false,
  supportBigNumbers: true,
  bigNumberStrings: true,
});
await my.query("SET time_zone = '+00:00'");

const pgClient = new pg.Client({ connectionString: env('SUPABASE_DB_URL'), ssl: { rejectUnauthorized: false } });
await pgClient.connect();

const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SECRET_KEY'), {
  auth: { persistSession: false, autoRefreshToken: false },
});

const createdAuthIds = [];

try {
  const mysqlUsers = (await my.query('SELECT id, email, password, email_verified_at FROM users ORDER BY id'))[0];

  // ─── Vérification de la cible ──────────────────────────────────────────────
  if (reset) {
    await resetTarget(mysqlUsers.map((u) => u.email.toLowerCase()));
  } else {
    for (const table of TABLES) {
      const { rows } = await pgClient.query(`SELECT count(*)::int AS n FROM public.${table}`);
      if (rows[0].n > 0) {
        throw new Error(`La table public.${table} n'est pas vide : relancez avec --reset pour la remplacer.`);
      }
    }
  }

  // ─── Comptes Supabase Auth ─────────────────────────────────────────────────
  const authIdByUserId = new Map();
  for (const user of mysqlUsers) {
    const attributes = { email: user.email, email_confirm: true };
    if (user.password) {
      // $2y$ (PHP) et $2a$ désignent le même bcrypt
      attributes.password_hash = user.password.replace(/^\$2y\$/, '$2a$');
    }
    const { data, error } = await supabase.auth.admin.createUser(attributes);
    if (error || !data.user) {
      throw new Error(`Création du compte Auth impossible pour l'utilisateur ${user.id} : ${error?.message}`);
    }
    createdAuthIds.push(data.user.id);
    authIdByUserId.set(String(user.id), { authId: data.user.id, hasPassword: !!user.password });
  }
  log(`${mysqlUsers.length} comptes Auth créés`);

  // ─── Tables ────────────────────────────────────────────────────────────────
  await pgClient.query('BEGIN');

  const counts = {};
  for (const table of TABLES) {
    const pgColumns = (
      await pgClient.query(
        `SELECT column_name, data_type, udt_name FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = $1`,
        [table],
      )
    ).rows;
    const pgTypes = new Map(pgColumns.map((c) => [c.column_name, c.data_type === 'USER-DEFINED' ? c.udt_name : c.data_type]));

    const [rows, fields] = await my.query(`SELECT * FROM \`${table}\``);
    const mysqlColumns = fields.map((f) => f.name);

    const unexpected = mysqlColumns.filter((c) => !pgTypes.has(c) && !(DROPPED_COLUMNS[table] ?? []).includes(c));
    if (unexpected.length > 0) {
      throw new Error(`Colonnes MySQL sans équivalent dans public.${table} : ${unexpected.join(', ')}`);
    }

    const columns = mysqlColumns.filter((c) => pgTypes.has(c));
    if (table === 'users') {
      columns.push('auth_id', 'has_password');
    }

    const convert = (column, value) => {
      if (value === null || value === undefined) return null;
      const type = pgTypes.get(column);
      if (type === 'boolean') return value === true || String(value) === '1';
      if (type === 'timestamp with time zone') return `${value}+00`;
      return value;
    };

    const values = rows.map((row) => {
      const out = columns.map((column) => {
        if (table === 'users' && column === 'auth_id') return authIdByUserId.get(String(row.id)).authId;
        if (table === 'users' && column === 'has_password') return authIdByUserId.get(String(row.id)).hasPassword;
        return convert(column, row[column]);
      });
      return out;
    });

    const columnList = columns.map((c) => `"${c}"`).join(', ');
    for (let i = 0; i < values.length; i += 200) {
      const batch = values.slice(i, i + 200);
      const params = [];
      const tuples = batch.map((rowValues) => {
        const placeholders = rowValues.map((value) => {
          params.push(value);
          return `$${params.length}`;
        });
        return `(${placeholders.join(', ')})`;
      });
      await pgClient.query(`INSERT INTO public.${table} (${columnList}) VALUES ${tuples.join(', ')}`, params);
    }

    if (pgTypes.has('id')) {
      await pgClient.query(
        `SELECT setval(pg_get_serial_sequence('public.${table}', 'id'),
                       GREATEST((SELECT COALESCE(MAX(id), 0) FROM public.${table}), 1),
                       (SELECT COUNT(*) > 0 FROM public.${table}))`,
      );
    }

    counts[table] = rows.length;
    log(`${table} : ${rows.length} lignes`);
  }

  await pgClient.query('COMMIT');

  // ─── Contrôle des volumes ──────────────────────────────────────────────────
  for (const table of TABLES) {
    const { rows } = await pgClient.query(`SELECT count(*)::int AS n FROM public.${table}`);
    if (rows[0].n !== counts[table]) {
      throw new Error(`Écart sur ${table} : MySQL ${counts[table]}, Supabase ${rows[0].n}`);
    }
  }
  log('volumes identiques dans les deux bases');

  // ─── Fichiers ──────────────────────────────────────────────────────────────
  if (process.env.STORAGE_DIR) {
    const files = await walk(process.env.STORAGE_DIR);
    let uploaded = 0;
    for (const file of files) {
      const relative = path.relative(process.env.STORAGE_DIR, file).split(path.sep).join('/');
      const contentType = CONTENT_TYPES[path.extname(file).toLowerCase()];
      if (!contentType) {
        log(`fichier ignoré (type non image) : ${relative}`);
        continue;
      }
      const { error } = await supabase.storage
        .from('uploads')
        .upload(relative, await readFile(file), { contentType, upsert: true });
      if (error) {
        throw new Error(`Envoi du fichier ${relative} impossible : ${error.message}`);
      }
      uploaded++;
    }
    log(`${uploaded} fichiers envoyés dans le bucket uploads`);
  }
} catch (error) {
  await pgClient.query('ROLLBACK').catch(() => {});
  for (const authId of createdAuthIds) {
    await supabase.auth.admin.deleteUser(authId).catch(() => {});
  }
  console.error('[import] échec, aucune donnée conservée :', error.message);
  process.exitCode = 1;
} finally {
  await my.end();
  await pgClient.end();
}

async function resetTarget(emails) {
  const { rows } = await pgClient.query('SELECT auth_id FROM public.users WHERE auth_id IS NOT NULL');
  const authIds = new Set(rows.map((r) => r.auth_id));

  // Comptes Auth restés orphelins d'un import précédent
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    data.users.filter((u) => u.email && emails.includes(u.email.toLowerCase())).forEach((u) => authIds.add(u.id));
    if (data.users.length < 1000) break;
  }

  await pgClient.query(`TRUNCATE ${TABLES.map((t) => `public.${t}`).join(', ')} RESTART IDENTITY CASCADE`);
  for (const authId of authIds) {
    const { error } = await supabase.auth.admin.deleteUser(authId);
    if (error && error.status !== 404) throw error;
  }
  log(`cible vidée (${authIds.size} comptes Auth supprimés)`);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (!entry.name.startsWith('.')) files.push(full);
  }
  return files;
}
