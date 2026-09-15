import { authenticate } from '@/server/auth';
import { HttpError, input, json, route } from '@/server/http';
import { formatUser } from '@/server/profile/format';
import { updateUser } from '@/server/profile/update';
import { db } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** UserProfileController::show */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  return json({ user: formatUser(user) });
});

/** UserProfileController::updatePersonalInfo */
export const PUT = route(async (req) => {
  const { user } = await authenticate(req);

  const validated = await validate(await input(req), {
    first_name: ['sometimes', 'string', 'max:255'],
    last_name: ['sometimes', 'string', 'max:255'],
    email: ['sometimes', 'email', 'max:255', `unique:users,email,${user.id}`],
    phone: ['nullable', 'string', 'max:20'],
    phone_country_code: ['nullable', 'string', 'max:5'],
    birth_date: ['nullable', 'date', 'before:today'],
    address_street: ['nullable', 'string', 'max:255'],
    address_city: ['nullable', 'string', 'max:255'],
    address_postal_code: ['nullable', 'string', 'max:20'],
    address_country: ['nullable', 'string', 'max:255'],
  });

  // Le compte Supabase Auth porte aussi l'email (connexion) : il est modifié avant la ligne users
  const newEmail = typeof validated.email === 'string' ? validated.email : null;
  const authEmailChanges = !!user.auth_id && newEmail !== null && newEmail.toLowerCase() !== String(user.email).toLowerCase();

  if (authEmailChanges) {
    const { error } = await db().auth.admin.updateUserById(user.auth_id!, { email: newEmail!, email_confirm: true });
    if (error) {
      if (error.code === 'email_exists' || error.code === 'user_already_exists') {
        const message = 'The email has already been taken.';
        throw new HttpError(422, { message, errors: { email: [message] } });
      }
      throw error;
    }
  }

  let fresh;
  try {
    fresh = await updateUser(user, validated);
  } catch (error) {
    if (authEmailChanges) {
      const { error: rollbackError } = await db().auth.admin.updateUserById(user.auth_id!, {
        email: user.email,
        email_confirm: true,
      });
      if (rollbackError) {
        console.error('[profile] restauration de l\'email Auth impossible', rollbackError);
      }
    }
    throw error;
  }

  return json({
    message: 'Informations mises à jour.',
    user: formatUser(fresh),
  });
});
