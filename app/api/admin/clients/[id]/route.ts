import { route } from '@/server/http';
import { destroy, show } from '@/server/admin-users/clients';
import type { IdParams } from '@/server/admin-users/users';

export const dynamic = 'force-dynamic';

// AdminClientController::show
export const GET = route<IdParams>(show);

// AdminClientController::destroy
export const DELETE = route<IdParams>(destroy);
