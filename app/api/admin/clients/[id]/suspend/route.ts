import { route } from '@/server/http';
import { updateStatus, type IdParams } from '@/server/admin-users/users';

export const dynamic = 'force-dynamic';

// AdminClientController::suspend
export const POST = route<IdParams>((req, params) => updateStatus(req, params, 'client_status', 'SUSPENDU', 'Client suspendu avec succes.'));
