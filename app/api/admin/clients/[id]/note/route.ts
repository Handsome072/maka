import { route } from '@/server/http';
import { addNote, type IdParams } from '@/server/admin-users/users';

export const dynamic = 'force-dynamic';

// AdminClientController::addNote
export const POST = route<IdParams>((req, params) => addNote(req, params, 'Note ajoutee.'));
