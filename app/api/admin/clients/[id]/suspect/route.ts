import { route } from '@/server/http';
import { toggleSuspect } from '@/server/admin-users/clients';
import type { IdParams } from '@/server/admin-users/users';

export const dynamic = 'force-dynamic';

// AdminClientController::toggleSuspect
export const POST = route<IdParams>(toggleSuspect);
