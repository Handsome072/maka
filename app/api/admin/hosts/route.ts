import { route } from '@/server/http';
import { index } from '@/server/admin-users/hosts';

export const dynamic = 'force-dynamic';

// AdminHostController::index
export const GET = route(index);
