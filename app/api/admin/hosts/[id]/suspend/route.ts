import { route } from '@/server/http';
import { updateStatus, type IdParams } from '@/server/admin-users/users';

export const dynamic = 'force-dynamic';

// AdminHostController::suspend
export const POST = route<IdParams>((req, params) => updateStatus(req, params, 'host_status', 'SUSPENDU', 'Hôte suspendu avec succès.'));
