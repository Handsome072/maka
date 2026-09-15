import { transitionListing } from '@/server/admin-listings/format';
import { authenticateAdmin } from '@/server/auth';
import { input, intParam, json, route } from '@/server/http';

export const dynamic = 'force-dynamic';

/** AdminListingController::suspend */
export const POST = route<{ id: string }>(async (req, params) => {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'Listing');

  const result = await transitionListing(id, {
    from: 'active',
    to: 'archived',
    refusal: 'Seules les annonces actives peuvent être suspendues.',
    success: 'Annonce suspendue.',
    reason: async () => (await input(req)).reason,
  });

  return json(result.body, result.status);
});
