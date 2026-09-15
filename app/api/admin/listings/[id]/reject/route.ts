import { transitionListing } from '@/server/admin-listings/format';
import { authenticateAdmin } from '@/server/auth';
import { input, intParam, json, route } from '@/server/http';

export const dynamic = 'force-dynamic';

/** AdminListingController::reject */
export const POST = route<{ id: string }>(async (req, params) => {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'Listing');

  const result = await transitionListing(id, {
    from: 'pending',
    to: 'rejected',
    refusal: 'Seules les annonces en attente peuvent être refusées.',
    success: 'Annonce refusée.',
    reason: async () => (await input(req)).reason,
  });

  return json(result.body, result.status);
});
