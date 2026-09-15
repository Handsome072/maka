import { authenticate, hasVerifiedEmail } from '@/server/auth';
import { ymd } from '@/server/format';
import { json, route } from '@/server/http';
import { profilePhotoFullUrl } from '@/server/storage';

export const dynamic = 'force-dynamic';

export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  return json({
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      email_verified: hasVerifiedEmail(user),
      birth_date: ymd(user.birth_date),
      receive_marketing: user.receive_marketing,
      profile_photo_url: profilePhotoFullUrl(user.profile_photo_url),
    },
  });
});
