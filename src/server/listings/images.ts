import { claimUpload, isUploadRef, saveBase64Image } from '@/server/storage';

/**
 * Image d'annonce (host_photo, chalet_photos[]) : chaîne base64 « data:image/…;base64,… » comme sous Laravel,
 * ou référence d'envoi direct « storage:tmp/<auth_id>/<fichier> » (limite de 4,5 Mo des corps de requête Vercel).
 * Renvoie le chemin de stockage, ou null si la référence est invalide ou la valeur n'est pas une chaîne.
 */
export async function storeListingImage(value: unknown, directory: string, authId: string | null): Promise<string | null> {
  if (isUploadRef(value)) {
    if (!authId) {
      return null;
    }
    const claimed = await claimUpload(value, { authId, directory, naming: 'img' });
    return claimed?.path ?? null;
  }
  if (typeof value === 'string') {
    // Laravel décodait toute chaîne comme du base64 (préfixe data: facultatif)
    return saveBase64Image(value, directory);
  }
  return null;
}
