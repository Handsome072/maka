import { route } from '@/server/http';
import { index } from '@/server/admin-users/clients';

export const dynamic = 'force-dynamic';

// AdminClientController::index
export const GET = route(index);
