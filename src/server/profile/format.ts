import { hasVerifiedEmail, type UserRow } from '@/server/auth';
import { monthYear, ymd } from '@/server/format';
import { profilePhotoFullUrl } from '@/server/storage';

export const NOTIFICATION_PREFERENCE_KEYS = [
  'reservations_email',
  'reservations_sms',
  'messages_email',
  'messages_sms',
  'reminders_email',
  'reminders_sms',
  'promotions_email',
  'promotions_sms',
] as const;

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  reservations_email: true,
  reservations_sms: false,
  messages_email: true,
  messages_sms: false,
  reminders_email: true,
  reminders_sms: false,
  promotions_email: false,
  promotions_sms: false,
};

/** UserProfileController::formatUser */
export function formatUser(user: UserRow) {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone ?? null,
    phone_country_code: user.phone_country_code ?? null,
    birth_date: ymd(user.birth_date),
    role: user.role,
    email_verified: hasVerifiedEmail(user),
    phone_verified: user.phone_verified,
    identity_verified: user.identity_verified,
    address_street: user.address_street ?? null,
    address_city: user.address_city ?? null,
    address_postal_code: user.address_postal_code ?? null,
    address_country: user.address_country ?? null,
    bio: user.bio ?? null,
    city: user.city ?? null,
    profession: user.profession ?? null,
    languages_spoken: user.languages_spoken ?? [],
    interests: user.interests ?? [],
    profile_photo_url: profilePhotoFullUrl(user.profile_photo_url),
    preferred_language: user.preferred_language,
    preferred_currency: user.preferred_currency,
    timezone: user.timezone,
    notification_preferences: user.notification_preferences ?? DEFAULT_NOTIFICATION_PREFERENCES,
    receive_marketing: user.receive_marketing,
    member_since: ymd(user.created_at),
  };
}

/** UserProfileController::publicProfile (sans listings_count, calculé par la route). */
export function formatPublicProfile(user: UserRow, listingsCount: number) {
  return {
    first_name: user.first_name,
    profile_photo_url: profilePhotoFullUrl(user.profile_photo_url),
    bio: user.bio ?? null,
    city: user.city ?? null,
    profession: user.profession ?? null,
    languages_spoken: user.languages_spoken ?? [],
    interests: user.interests ?? [],
    email_verified: hasVerifiedEmail(user),
    phone_verified: user.phone_verified,
    identity_verified: user.identity_verified,
    member_since: monthYear(user.created_at),
    listings_count: listingsCount,
  };
}
