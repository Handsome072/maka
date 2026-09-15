import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { listingTitleExists, mysqlNumber, phpTruthy } from '@/server/listings';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** ListingController::checkTitle */
export const GET = route(async (req) => {
  await authenticate(req);

  const data = await input(req);
  await validate(data, { title: 'required|string|max:255' });

  let excludeId: number | null = null;
  if (phpTruthy(data.exclude_id)) {
    // MySQL compare id != 'valeur' après conversion numérique : une valeur non entière n'exclut aucune ligne
    const numeric = mysqlNumber(data.exclude_id);
    if (Number.isSafeInteger(numeric)) {
      excludeId = numeric;
    }
  }

  return json({ exists: await listingTitleExists(data.title, excludeId) });
});
