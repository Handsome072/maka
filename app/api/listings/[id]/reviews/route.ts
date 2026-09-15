import { authenticate } from '@/server/auth';
import { input, intParam, json, notFound, route } from '@/server/http';
import { formatReview, nowTimestamp, type Row } from '@/server/listings';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** ReviewController::store */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Listing');

  const listing = must(
    await db().from('listings').select('id').eq('status', 'active').eq('id', id).maybeSingle(),
  ) as Row | null;
  if (!listing) {
    notFound('Listing', id);
  }

  const validated = await validate(await input(req), {
    rating: 'required|numeric|min:1|max:5',
    text: 'required|string|max:500',
  });

  const now = nowTimestamp();
  const rating = validated.rating;

  const created = must(
    await db()
      .from('reviews')
      .insert({
        listing_id: listing.id,
        user_id: user.id,
        rating,
        text: validated.text,
        cleanliness_rating: rating,
        accuracy_rating: rating,
        checkin_rating: rating,
        communication_rating: rating,
        location_rating: rating,
        value_rating: rating,
        updated_at: now,
        created_at: now,
      })
      .select('id')
      .single(),
  ) as Row;

  return json(
    { review: formatReview({ id: created.id, rating, text: validated.text, created_at: now }, user) },
    201,
  );
});
