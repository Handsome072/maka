import { route } from '@/server/http';
import { show } from '@/server/admin-users/hosts';
import type { IdParams } from '@/server/admin-users/users';

export const dynamic = 'force-dynamic';

// AdminHostController::show
export const GET = route<IdParams>(show);
