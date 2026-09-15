import { randomBytes } from 'node:crypto';
import { HttpError } from '@/server/http';
import { db } from '@/server/supabase';
import { BUCKET, UPLOAD_REF_PREFIX, claimUpload, deleteFiles, isUploadRef, putFile } from '@/server/storage';

/**
 * Images envoyées en multipart (fichier) ou directement dans Supabase Storage (référence « storage:tmp/… »),
 * validées comme la règle « image » de Laravel 12 : type détecté d'après le contenu (guessExtension),
 * limité à jpg, jpeg, png, gif, bmp, webp. Le SVG est refusé (Laravel 12 exige image:allow_svg).
 */
export const LARAVEL_IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/webp': 'webp',
};

const NOT_AN_IMAGE = 'application/octet-stream';

export type ImageInput =
  | { kind: 'missing' }
  | { kind: 'file'; buffer: Buffer; mime: string | null; standIn: Blob }
  | { kind: 'ref'; ref: string; standIn: Blob }
  | { kind: 'other' };

function sniffImageMime(b: Buffer): string | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (b.length >= 6 && ['GIF87a', 'GIF89a'].includes(b.subarray(0, 6).toString('ascii'))) return 'image/gif';
  if (b.length >= 12 && b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  if (b.length >= 2 && b[0] === 0x42 && b[1] === 0x4d) return 'image/bmp';
  return null;
}

/** Blob vide portant la taille et le type à valider (évite de télécharger le fichier). */
function standInBlob(size: number, type: string): Blob {
  const blob = new Blob([], { type });
  Object.defineProperty(blob, 'size', { value: size });
  return blob;
}

/** Vérifie une référence d'envoi direct sans déplacer le fichier (mêmes contrôles que claimUpload). */
async function inspectUploadRef(ref: string, authId: string | null, maxBytes: number): Promise<Blob> {
  const invalid = standInBlob(0, NOT_AN_IMAGE);
  if (!authId) {
    return invalid;
  }
  const tmpPath = ref.slice(UPLOAD_REF_PREFIX.length);
  const prefix = `tmp/${authId}/`;
  const fileName = tmpPath.slice(prefix.length);
  if (!tmpPath.startsWith(prefix) || tmpPath.includes('..') || fileName === '' || fileName.includes('/')) {
    return invalid;
  }

  const bucket = db().storage.from(BUCKET);
  const { data, error } = await bucket.list(`tmp/${authId}`, { search: fileName, limit: 10 });
  if (error) {
    throw error;
  }
  const object = data?.find((item) => item.name === fileName);
  if (!object) {
    return invalid;
  }

  const size = Number(object.metadata?.size ?? 0);
  const mime = String(object.metadata?.mimetype ?? '');
  const isImage = mime in LARAVEL_IMAGE_EXTENSIONS;
  if (!isImage || size > maxBytes) {
    await bucket.remove([tmpPath]);
  }
  return standInBlob(size, isImage ? mime : NOT_AN_IMAGE);
}

/** Lit le champ image d'une requête et prépare la valeur à passer à validate(). */
export async function readImageInput(
  data: Record<string, any>,
  attribute: string,
  options: { authId: string | null; maxBytes: number },
): Promise<ImageInput> {
  if (!(attribute in data)) {
    return { kind: 'missing' };
  }
  const value = data[attribute];
  if (value instanceof Blob) {
    const buffer = Buffer.from(await value.arrayBuffer());
    const mime = sniffImageMime(buffer);
    return { kind: 'file', buffer, mime, standIn: standInBlob(buffer.length, mime ?? NOT_AN_IMAGE) };
  }
  if (isUploadRef(value)) {
    return { kind: 'ref', ref: value, standIn: await inspectUploadRef(value, options.authId, options.maxBytes) };
  }
  return { kind: 'other' };
}

/** Données de validation où le fichier est remplacé par son type détecté et sa taille. */
export function imageValidationData(data: Record<string, any>, attribute: string, image: ImageInput): Record<string, any> {
  if (image.kind === 'file' || image.kind === 'ref') {
    return { ...data, [attribute]: image.standIn };
  }
  return data;
}

/** Réponse 422 identique à l'échec de la règle « image ». */
export function imageValidationError(attribute: string): HttpError {
  const message = `The ${attribute.replace(/_/g, ' ')} field must be an image.`;
  return new HttpError(422, { message, errors: { [attribute]: [message] } });
}

/** Nom aléatoire de 40 caractères alphanumériques comme Str::random(40) (UploadedFile::hashName). */
function randomName(length = 40): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let name = '';
  while (name.length < length) {
    for (const byte of randomBytes(length)) {
      if (byte < 248 && name.length < length) {
        name += alphabet[byte % 62];
      }
    }
  }
  return name;
}

/**
 * $request->file(...)->store($directory, 'public') pour une image déjà validée :
 * renvoie le chemin stocké (« profile-photos/<nom>.jpg », « conversations/12/<nom>.png »).
 */
export async function storeImage(
  image: ImageInput,
  attribute: string,
  options: { authId: string | null; directory: string; maxBytes: number },
): Promise<string> {
  if (image.kind === 'file' && image.mime) {
    const path = `${options.directory}/${randomName()}.${LARAVEL_IMAGE_EXTENSIONS[image.mime]}`;
    await putFile(path, image.buffer, image.mime);
    return path;
  }

  if (image.kind === 'ref' && options.authId) {
    const claimed = await claimUpload(image.ref, {
      authId: options.authId,
      directory: options.directory,
      maxBytes: options.maxBytes,
      naming: 'hash',
    });
    if (!claimed) {
      throw imageValidationError(attribute);
    }
    if (!(claimed.mime in LARAVEL_IMAGE_EXTENSIONS)) {
      await deleteFiles([claimed.path]);
      throw imageValidationError(attribute);
    }
    return claimed.path;
  }

  throw imageValidationError(attribute);
}
