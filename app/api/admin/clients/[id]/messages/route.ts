import { route } from '@/server/http';
import { getMessages, sendAdminMessage } from '@/server/admin-users/messages';
import type { IdParams } from '@/server/admin-users/users';

export const dynamic = 'force-dynamic';

// AdminClientController::getMessages
export const GET = route<IdParams>(getMessages);

// AdminClientController::sendAdminMessage
export const POST = route<IdParams>(sendAdminMessage);
