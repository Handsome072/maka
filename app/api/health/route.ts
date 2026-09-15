import { iso8601 } from '@/server/format';
import { json, route } from '@/server/http';

export const dynamic = 'force-dynamic';

export const GET = route(async () =>
  json({
    status: 'ok',
    service: 'Séjoura API',
    timestamp: iso8601(new Date()),
  }),
);
