import { transitionListing } from '@/server/admin-listings/format';
import { authenticateAdmin } from '@/server/auth';
import { intParam, json, route } from '@/server/http';

export const dynamic = 'force-dynamic';

/** AdminListingController::approve */
export const POST = route<{ id: string }>(async (req, params) => {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'Listing');

  const result = await transitionListing(id, {
    from: 'pending',
    to: 'active',
    refusal: 'Seules les annonces en attente peuvent être approuvées.',
    success: 'Annonce approuvée avec succès.',
  });

  return json(result.body, result.status);
});
