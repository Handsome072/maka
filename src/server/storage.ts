import { randomBytes, randomUUID } from 'node:crypto';
import { abort } from './http';
import { db, supabaseUrl } from './supabase';

/**
 * Stockage des fichiers dans le bucket public « uploads », avec les mêmes chemins que
 * storage/app/public de Laravel (listings/{id}/…, profile-photos/…, conversations/{id}/…).
 */
export const BUCKET = 'uploads';

const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
};

/**
 * Types acceptés par la règle de validation « image » de Laravel 12.
 * Le SVG est exclu (il peut contenir du script et le bucket est public).
 */
export const IMAGE_MIME_TYPES = Object.keys(MIME_EXTENSIONS);

/** Storage::disk('public')->url($path) */
export function storageUrl(path: string): string {
  return `${supabaseUrl()}/storage/v1/object/public/${BUCKET}/${path.replace(/^\/+/, '')}`;
}

/** URL d'une photo d'annonce : les chemins http (photos de démo) sont gardés tels quels. */
export function photoUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  return path.startsWith('http') ? path : storageUrl(path);
}

/** $user->profile_photo_full_url (la colonne contient « /storage/… » comme sous Laravel). */
export function profilePhotoFullUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  if (value.startsWith('http')) {
    return value;
  }
  return storageUrl(value.replace(/^\/+/, '').replace(/^storage\//, ''));
}

export async function putFile(path: string, data: Buffer | Blob | ArrayBuffer, contentType: string): Promise<void> {
  const { error } = await db().storage.from(BUCKET).upload(path, data, { contentType, upsert: false });
  if (error) {
    throw error;
  }
}

/** Storage::disk('public')->delete() : ignore les chemins http et les fichiers déjà absents. */
export async function deleteFiles(paths: Array<string | null | undefined>): Promise<void> {
  const local = paths.filter((p): p is string => !!p && !p.startsWith('http')).map((p) => p.replace(/^\/+/, ''));
  if (local.length === 0) {
    return;
  }
  const { error } = await db().storage.from(BUCKET).remove(local);
  if (error) {
    console.error('[storage] suppression impossible', local, error);
  }
}

/** Nom proche de uniqid('img_', true) de PHP. */
function uniqueName(prefix: string, ext: string): string {
  return `${prefix}${Date.now().toString(16)}${randomBytes(4).toString('hex')}.${ext}`;
}

/** Nom aléatoire de 40 caractères comme UploadedFile::store(). */
function hashName(ext: string): string {
  return `${randomBytes(20).toString('hex')}.${ext}`;
}

function sniffMime(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buffer.length >= 6 && buffer.subarray(0, 4).toString('ascii') === 'GIF8') return 'image/gif';
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  if (buffer.length >= 2 && buffer[0] === 0x42 && buffer[1] === 0x4d) return 'image/bmp';
  return null;
}

/** ListingController::saveBase64Image : décode une image base64 et renvoie son chemin de stockage. */
export async function saveBase64Image(base64Data: string, directory: string): Promise<string> {
  const imageData = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const decoded = Buffer.from(imageData, 'base64');
  const mime = sniffMime(decoded);
  const ext = mime ? MIME_EXTENSIONS[mime] : 'jpg';
  const path = `${directory}/${uniqueName('img_', ext)}`;
  await putFile(path, decoded, mime ?? 'image/jpeg');
  return path;
}

// ─── Envois directs depuis le navigateur ────────────────────────────────────────
//
// Vercel limite le corps d'une requête à 4,5 Mo : les photos (base64 des annonces, photo de profil,
// images de messages) sont donc envoyées directement dans Supabase Storage via une URL signée,
// puis la route reçoit la référence « storage:tmp/<auth_id>/<fichier> » et déplace le fichier.

export const UPLOAD_REF_PREFIX = 'storage:';

export function isUploadRef(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(UPLOAD_REF_PREFIX);
}

export async function createSignedUpload(authId: string, contentType: string): Promise<{ path: string; token: string; ref: string }> {
  const ext = MIME_EXTENSIONS[contentType];
  if (!ext) {
    abort(422, 'Type de fichier non autorisé.');
  }
  const path = `tmp/${authId}/${randomUUID()}.${ext}`;
  const { data, error } = await db().storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    throw error ?? new Error('createSignedUploadUrl a échoué');
  }
  return { path, token: data.token, ref: `${UPLOAD_REF_PREFIX}${path}` };
}

export type ClaimedUpload = { path: string; size: number; mime: string };

/**
 * Déplace un fichier envoyé par le navigateur vers son emplacement définitif.
 * Vérifie qu'il appartient à l'utilisateur, qu'il existe, sa taille et son type.
 * Renvoie null si la référence est invalide (la route répond alors comme un fichier manquant).
 */
export async function claimUpload(
  ref: string,
  options: { authId: string; directory: string; maxBytes?: number; naming?: 'hash' | 'img' },
): Promise<ClaimedUpload | null> {
  const tmpPath = ref.slice(UPLOAD_REF_PREFIX.length);
  const expectedPrefix = `tmp/${options.authId}/`;
  if (!tmpPath.startsWith(expectedPrefix) || tmpPath.includes('..') || tmpPath.slice(expectedPrefix.length).includes('/')) {
    return null;
  }

  const bucket = db().storage.from(BUCKET);
  const fileName = tmpPath.slice(expectedPrefix.length);
  const { data: listing, error } = await bucket.list(`tmp/${options.authId}`, { search: fileName, limit: 10 });
  if (error) {
    throw error;
  }
  const object = listing?.find((item) => item.name === fileName);
  if (!object) {
    return null;
  }

  const size = Number(object.metadata?.size ?? 0);
  const mime = String(object.metadata?.mimetype ?? '');
  const ext = MIME_EXTENSIONS[mime];
  if (!ext || (options.maxBytes !== undefined && size > options.maxBytes)) {
    await bucket.remove([tmpPath]);
    return null;
  }

  const finalName = options.naming === 'img' ? uniqueName('img_', ext) : hashName(ext);
  const finalPath = `${options.directory}/${finalName}`;
  const { error: moveError } = await bucket.move(tmpPath, finalPath);
  if (moveError) {
    throw moveError;
  }
  return { path: finalPath, size, mime };
}
