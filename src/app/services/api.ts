/**
 * API Service for HOMIQIO Backend
 * Handles all HTTP requests to the Laravel API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Token storage keys
const TOKEN_KEY = 'homiqio_auth_token';

/**
 * Get the stored authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store the authentication token
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Remove the authentication token
 */
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Base fetch wrapper with authentication and error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Une erreur est survenue');
    (error as any).status = response.status;
    (error as any).data = data;
    throw error;
  }

  return data as T;
}

// API Response types
export interface NotificationPreferences {
  reservations_email: boolean;
  reservations_sms: boolean;
  messages_email: boolean;
  messages_sms: boolean;
  reminders_email: boolean;
  reminders_sms: boolean;
  promotions_email: boolean;
  promotions_sms: boolean;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  email_verified: boolean;
  birth_date?: string;
  receive_marketing?: boolean;
  phone?: string;
  phone_country_code?: string;
  address_street?: string;
  address_city?: string;
  address_postal_code?: string;
  address_country?: string;
  bio?: string;
  city?: string;
  profession?: string;
  languages_spoken?: string[];
  interests?: string[];
  profile_photo_url?: string;
  preferred_language?: string;
  preferred_currency?: string;
  timezone?: string;
  notification_preferences?: NotificationPreferences;
  phone_verified?: boolean;
  identity_verified?: boolean;
  member_since?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface VerifyEmailResponse {
  message: string;
  password_setup_token: string;
  user: User;
}

export interface MessageResponse {
  message: string;
}

export interface UserResponse {
  user: User;
}

// Auth API functions
export const authApi = {
  /**
   * Register a new user (email-first flow - no password)
   */
  register: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    birth_date?: string;
    receive_marketing?: boolean;
  }): Promise<RegisterResponse> => {
    return apiFetch<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Note: No token is returned - user must verify email first
  },

  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<MessageResponse> => {
    const response = await apiFetch<MessageResponse>('/auth/logout', {
      method: 'POST',
    });
    removeAuthToken();
    return response;
  },

  /**
   * Get current user profile
   */
  getUser: async (): Promise<UserResponse> => {
    return apiFetch<UserResponse>('/auth/user');
  },

  /**
   * Verify email with token - returns password setup token
   */
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    return apiFetch<VerifyEmailResponse>(`/auth/verify-email/${token}`);
  },

  /**
   * Set password after email verification
   */
  setPassword: async (token: string, password: string, password_confirmation: string): Promise<AuthResponse> => {
    const response = await apiFetch<AuthResponse>('/auth/set-password', {
      method: 'POST',
      body: JSON.stringify({ token, password, password_confirmation }),
    });
    setAuthToken(response.token);
    return response;
  },

  /**
   * Resend verification email
   */
  resendVerification: async (): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>('/auth/resend-verification', {
      method: 'POST',
    });
  },

  /**
   * Request password reset — sends email via Mailpit (local) or SMTP (production)
   */
  forgotPassword: async (email: string): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password using token from the reset email
   */
  resetPassword: async (
    email: string,
    token: string,
    password: string,
    password_confirmation: string
  ): Promise<AuthResponse> => {
    const response = await apiFetch<AuthResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, password, password_confirmation }),
    });
    setAuthToken(response.token);
    return response;
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

// ─── Listing Types ────────────────────────────────────────────────────────────

export interface ListingPhoto {
  id: number;
  url: string;
  order: number;
}

export interface Listing {
  id: number;
  status: 'draft' | 'pending' | 'active' | 'rejected' | 'archived';
  title: string | null;
  subtitle: string | null;
  city: string | null;
  province: string;
  country: string;
  space_type: string | null;
  capacity: number;
  bathrooms: number;
  base_price: string | null;
  currency: string;
  cancellation_policy: string | null;
  reservation_mode: string;
  host_photo_url: string | null;
  photos: ListingPhoto[];
  created_at: string;
  updated_at: string;
  // Detail fields (available from GET /listings/:id)
  rental_frequency?: string | null;
  full_address?: string | null;
  street?: string | null;
  postal_code?: string | null;
  mrc?: string | null;
  county?: string | null;
  adults?: number | null;
  bedrooms_data?: any[] | null;
  open_areas_data?: any[] | null;
  amenities?: string[] | null;
  expectations?: Record<string, string> | null;
  description?: string | null;
  about_chalet?: string | null;
  host_availability?: string | null;
  neighborhood?: string | null;
  transport?: string | null;
  other_info?: string | null;
  permissions?: Record<string, string> | null;
  arrival_time?: string | null;
  departure_time?: string | null;
  min_age?: number | null;
  min_stay?: string | null;
  max_stay?: string | null;
  arrival_days?: Record<string, boolean> | null;
  departure_days?: Record<string, boolean> | null;
  weekend_price?: string | null;
  weekly_price?: string | null;
  monthly_price?: string | null;
  cleaning_fee?: string | null;
  security_deposit?: string | null;
  extra_guest_fee?: string | null;
  pet_fee?: string | null;
  tax_registration?: any | null;
  accepted_local_laws?: boolean | null;
  wifi_speed?: string | null;
  has_wifi?: boolean | null;
  checkin_method?: string | null;
  checkin_instructions?: string | null;
  phone_number?: string | null;
  country_code?: string | null;
}

// ─── Review & Host Types (for property detail page) ─────────────────────────

export interface ReviewUser {
  first_name: string;
  profile_photo_url: string | null;
  member_since: string;
}

export interface Review {
  id: number;
  rating: number;
  text: string | null;
  created_at: string;
  user: ReviewUser;
}

export interface ReviewsSummary {
  count: number;
  average_rating: number | null;
  cleanliness_avg: number | null;
  accuracy_avg: number | null;
  checkin_avg: number | null;
  communication_avg: number | null;
  location_avg: number | null;
  value_avg: number | null;
  rating_distribution: Record<number, number>;
  is_guest_favorite: boolean;
}

export interface ListingHost {
  id: number;
  first_name: string;
  profile_photo_url: string | null;
  profession: string | null;
  interests: string[] | null;
  languages_spoken: string[] | null;
  identity_verified: boolean;
  phone_verified: boolean;
  member_since: string;
  reviews_count: number;
  average_rating: number | null;
  response_rate: number | null;
  response_time: string | null;
}

export interface ListingDetail extends Listing {
  latitude: number | null;
  longitude: number | null;
  host: ListingHost;
  reviews_summary: ReviewsSummary;
  reviews: Review[];
}

export interface ListingsResponse {
  listings: Listing[];
}

export interface ListingResponse {
  message: string;
  listing: Listing;
}

// ─── Listings API ─────────────────────────────────────────────────────────────

export const listingsApi = {
  /**
   * Check if a listing title already exists
   */
  checkTitle: async (title: string, excludeId?: number): Promise<{ exists: boolean }> => {
    const params = new URLSearchParams({ title });
    if (excludeId) params.append('exclude_id', String(excludeId));
    return apiFetch<{ exists: boolean }>(`/listings/check-title?${params.toString()}`);
  },

  /**
   * Create a new listing (full 24-step onboarding payload + base64 photos)
   */
  createListing: async (data: Record<string, unknown>): Promise<ListingResponse> => {
    return apiFetch<ListingResponse>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all listings for the authenticated user
   */
  getMyListings: async (): Promise<ListingsResponse> => {
    return apiFetch<ListingsResponse>('/listings');
  },

  /**
   * Get a single listing by ID (must belong to authenticated user)
   */
  getListing: async (id: number): Promise<{ listing: Listing }> => {
    return apiFetch<{ listing: Listing }>(`/listings/${id}`);
  },

  /**
   * Update an existing listing
   */
  updateListing: async (id: number, data: Record<string, unknown>): Promise<ListingResponse> => {
    return apiFetch<ListingResponse>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a listing (also deletes photos from storage)
   */
  deleteListing: async (id: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/listings/${id}`, {
      method: 'DELETE',
    });
  },
};

// ─── Public Listings API (no auth required) ─────────────────────────────────

export const publicListingsApi = {
  getAll: async (): Promise<ListingsResponse> => {
    return apiFetch<ListingsResponse>('/listings/public');
  },

  getOne: async (id: number): Promise<{ listing: ListingDetail }> => {
    return apiFetch<{ listing: ListingDetail }>(`/listings/public/${id}`);
  },
};

// ─── Reviews API ─────────────────────────────────────────────────────────────

export const reviewsApi = {
  create: async (listingId: number, data: { rating: number; text: string }) => {
    return apiFetch<{ review: unknown }>(`/listings/${listingId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ─── Admin Listings API ──────────────────────────────────────────────────────

export interface AdminListing extends Listing {
  host: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  rejection_reason?: string | null;
}

export interface AdminListingsResponse {
  listings: AdminListing[];
}

export interface AdminListingResponse {
  message: string;
  listing: AdminListing;
}

export const adminListingsApi = {
  getAll: async (params?: {
    status?: string;
    search?: string;
    city?: string;
    host_id?: number;
  }): Promise<AdminListingsResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.append(key, String(val));
      });
    }
    const qs = query.toString();
    return apiFetch<AdminListingsResponse>(`/admin/listings${qs ? `?${qs}` : ''}`);
  },

  getOne: async (id: number): Promise<{ listing: AdminListing }> => {
    return apiFetch<{ listing: AdminListing }>(`/admin/listings/${id}`);
  },

  approve: async (id: number): Promise<AdminListingResponse> => {
    return apiFetch<AdminListingResponse>(`/admin/listings/${id}/approve`, {
      method: 'POST',
    });
  },

  reject: async (id: number, reason?: string): Promise<AdminListingResponse> => {
    return apiFetch<AdminListingResponse>(`/admin/listings/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  suspend: async (id: number, reason?: string): Promise<AdminListingResponse> => {
    return apiFetch<AdminListingResponse>(`/admin/listings/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  delete: async (id: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/listings/${id}`, {
      method: 'DELETE',
    });
  },
};

// ─── Admin Payment Types ─────────────────────────────────────────────────────

export type AdminPaymentStatus = 'Reussi' | 'En attente' | 'Echoue' | 'Rembourse' | 'Annule';
export type AdminPayoutStatus = 'Verse' | 'En attente' | 'Suspendu' | 'Echoue';
export type AdminPaymentMethod = 'Carte bancaire' | 'PayPal' | 'Stripe' | 'Virement';

export interface AdminPayment {
  id: string;
  reservation_id: string;
  property: { name: string; id: number };
  client: { name: string; email: string; avatar: string; id: number };
  host: { name: string; email: string; avatar: string; id: number };
  total_amount: number;
  commission: number;
  payout_amount: number;
  method: AdminPaymentMethod;
  payment_status: AdminPaymentStatus;
  payout_status: AdminPayoutStatus;
  date: string;
  is_flagged: boolean;
}

export interface AdminPaymentDetail extends AdminPayment {
  property: { name: string; id: number; city: string; country: string };
  client: { name: string; email: string; phone: string; avatar: string; id: number };
  host: { name: string; email: string; phone: string; avatar: string; id: number; iban: string };
  pricing: {
    nightly_rate: number;
    nights: number;
    subtotal: number;
    cleaning_fee: number;
    service_fee: number;
    taxes: number;
    total_amount: number;
    commission: number;
    commission_rate: number;
    payout_amount: number;
  };
  payout_date: string | null;
  flag_reason: string | null;
  stripe_payment_id: string;
  history: { date: string; action: string; actor: string; details: string }[];
}

export interface AdminPaymentsListResponse {
  payments: AdminPayment[];
  total: number;
  page: number;
  per_page: number;
}

export interface AdminPaymentDetailResponse {
  payment: AdminPaymentDetail;
}

export interface AdminPaymentStatsResponse {
  total_revenue: number;
  total_commissions: number;
  total_payouts: number;
  successful_count: number;
  pending_count: number;
  failed_count: number;
  pending_payouts_count: number;
}

// ─── Admin Payments API ──────────────────────────────────────────────────────

export const adminPaymentsApi = {
  getPayments: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    payment_status?: string;
    payout_status?: string;
    method?: string;
    client?: string;
    host?: string;
    date_from?: string;
    date_to?: string;
    amount_min?: number;
    amount_max?: number;
  }): Promise<AdminPaymentsListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.append(key, String(val));
      });
    }
    const qs = query.toString();
    return apiFetch<AdminPaymentsListResponse>(`/admin/payments${qs ? `?${qs}` : ''}`);
  },

  getPayment: async (id: string): Promise<AdminPaymentDetailResponse> => {
    return apiFetch<AdminPaymentDetailResponse>(`/admin/payments/${id}`);
  },

  getStats: async (): Promise<AdminPaymentStatsResponse> => {
    return apiFetch<AdminPaymentStatsResponse>('/admin/payments/stats');
  },

  refund: async (id: string, data: { type: 'total' | 'partial'; amount?: number }): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/payments/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  cancelPayment: async (id: string): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/payments/${id}/cancel`, {
      method: 'POST',
    });
  },

  suspendPayout: async (id: string): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/payments/${id}/suspend-payout`, {
      method: 'POST',
    });
  },

  releasePayout: async (id: string): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/payments/${id}/release-payout`, {
      method: 'POST',
    });
  },

  flagFraud: async (id: string, reason?: string): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/payments/${id}/flag-fraud`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  blockTransaction: async (id: string): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/payments/${id}/block`, {
      method: 'POST',
    });
  },

  exportCSV: async (params?: Record<string, string>): Promise<Blob> => {
    const token = getAuthToken();
    const query = new URLSearchParams(params);
    const qs = query.toString();
    const response = await fetch(`${API_BASE_URL}/admin/payments/export${qs ? `?${qs}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/csv',
      },
    });
    return response.blob();
  },
};

// ─── User Profile & Settings API ────────────────────────────────────────────

export interface PublicProfile {
  first_name: string;
  profile_photo_url: string | null;
  bio: string | null;
  city: string | null;
  profession: string | null;
  languages_spoken: string[];
  interests: string[];
  email_verified: boolean;
  phone_verified: boolean;
  identity_verified: boolean;
  member_since: string;
  listings_count: number;
}

export const userProfileApi = {
  getProfile: async (): Promise<{ user: User }> => {
    return apiFetch<{ user: User }>('/user/profile');
  },

  updatePersonalInfo: async (data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    phone_country_code?: string;
    birth_date?: string;
    address_street?: string;
    address_city?: string;
    address_postal_code?: string;
    address_country?: string;
  }): Promise<{ message: string; user: User }> => {
    return apiFetch<{ message: string; user: User }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updatePassword: async (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>('/user/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateNotifications: async (prefs: NotificationPreferences): Promise<{
    message: string;
    notification_preferences: NotificationPreferences;
  }> => {
    return apiFetch('/user/notifications', {
      method: 'PUT',
      body: JSON.stringify({ notification_preferences: prefs }),
    });
  },

  updatePreferences: async (data: {
    preferred_language?: string;
    preferred_currency?: string;
    timezone?: string;
  }): Promise<{ message: string; user: User }> => {
    return apiFetch<{ message: string; user: User }>('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateBioProfile: async (data: {
    bio?: string;
    city?: string;
    profession?: string;
    languages_spoken?: string[];
    interests?: string[];
  }): Promise<{ message: string; user: User }> => {
    return apiFetch<{ message: string; user: User }>('/user/profile/bio', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  uploadPhoto: async (file: File): Promise<{ message: string; profile_photo_url: string }> => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${API_BASE_URL}/user/profile/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'upload');
    }
    return data;
  },

  getPublicProfile: async (): Promise<{ profile: PublicProfile }> => {
    return apiFetch<{ profile: PublicProfile }>('/user/profile/public');
  },

  deactivateAccount: async (password: string, reason?: string): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>('/user/account/deactivate', {
      method: 'POST',
      body: JSON.stringify({ password, reason }),
    });
  },
};

// ─── Messaging Types ──────────────────────────────────────────────────────────

export interface ConversationParticipant {
  id: number;
  first_name: string;
  last_name: string;
  profile_photo_url: string | null;
}

export interface ConversationReservation {
  id: number;
  check_in: string;
  check_out: string;
  guests_count: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  listing: {
    id: number;
    title: string;
    photo_url: string | null;
  };
}

export interface Conversation {
  id: number;
  reservation: ConversationReservation | null;
  listing: { id: number; title: string; photo_url: string | null } | null;
  host: ConversationParticipant;
  guest: ConversationParticipant;
  last_message: {
    text: string;
    sender_id: number;
    created_at: string;
    has_image: boolean;
  } | null;
  unread_count: number;
  is_archived: boolean;
  is_admin_conversation?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_role?: string;
  text: string | null;
  image_url: string | null;
  read_at: string | null;
  created_at: string;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  conversation: Conversation;
}

export interface SendMessageResponse {
  message: string;
  data: ChatMessage;
}

// ─── Messaging API ────────────────────────────────────────────────────────────

export type ConversationFilter = 'all' | 'pending' | 'upcoming' | 'active' | 'past';

export const messagesApi = {
  /**
   * Start or find a conversation with a listing's host
   */
  startConversation: async (listingId: number, message: string): Promise<{ conversation_id: number }> => {
    return apiFetch<{ conversation_id: number }>('/conversations/start', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId, message }),
    });
  },

  /**
   * Get total unread message count
   */
  getUnreadCount: async (role: 'host' | 'guest' = 'guest'): Promise<{ unread_count: number }> => {
    return apiFetch<{ unread_count: number }>(`/conversations/unread-count?role=${role}`);
  },

  /**
   * Get conversations for the current user (works for both host and guest)
   * When role=host, returns conversations linked to the user's listings
   * When role=guest, returns conversations where the user is the guest
   */
  getConversations: async (params?: {
    role?: 'host' | 'guest';
    filter?: ConversationFilter;
    search?: string;
    archived?: boolean;
  }): Promise<ConversationsResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.append(key, String(val));
      });
    }
    const qs = query.toString();
    return apiFetch<ConversationsResponse>(`/conversations${qs ? `?${qs}` : ''}`);
  },

  /**
   * Get messages for a specific conversation
   */
  getMessages: async (conversationId: number): Promise<ChatMessagesResponse> => {
    return apiFetch<ChatMessagesResponse>(`/conversations/${conversationId}/messages`);
  },

  /**
   * Send a text message
   */
  sendMessage: async (conversationId: number, text: string): Promise<SendMessageResponse> => {
    return apiFetch<SendMessageResponse>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  /**
   * Send an image message
   */
  sendImage: async (conversationId: number, file: File, text?: string): Promise<SendMessageResponse> => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('image', file);
    if (text) formData.append('text', text);

    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'envoi de l\'image');
    }
    return data;
  },

  /**
   * Mark conversation as read
   */
  markAsRead: async (conversationId: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/conversations/${conversationId}/read`, {
      method: 'POST',
    });
  },

  /**
   * Mark conversation as unread
   */
  markAsUnread: async (conversationId: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/conversations/${conversationId}/unread`, {
      method: 'POST',
    });
  },

  /**
   * Archive a conversation
   */
  archiveConversation: async (conversationId: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/conversations/${conversationId}/archive`, {
      method: 'POST',
    });
  },

  /**
   * Unarchive a conversation
   */
  unarchiveConversation: async (conversationId: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/conversations/${conversationId}/unarchive`, {
      method: 'POST',
    });
  },
};

// ─── Host Revenue Types ──────────────────────────────────────────────────────

export interface RevenueSummary {
  revenue_this_month: number;
  revenue_this_year: number;
  revenue_total: number;
  revenue_estimated: number;
  currency: string;
}

export interface RevenueChartMonth {
  month: number;
  revenue: number;
  gross: number;
  commission: number;
}

export interface RevenueChartYear {
  year: number;
  revenue: number;
}

export interface RevenueChartResponse {
  monthly: RevenueChartMonth[];
  yearly: RevenueChartYear[];
  selected_year: number;
}

export interface RevenueStats {
  total_nights: number;
  avg_revenue_per_night: number;
  avg_stay_duration: number;
  total_reservations: number;
}

export interface PayoutListing {
  id: number;
  title: string;
  city: string;
}

export interface Payout {
  id: number;
  reservation_id: number;
  listing: PayoutListing | null;
  reservation_dates: { check_in: string; check_out: string } | null;
  gross_amount: number;
  commission_amount: number;
  net_amount: number;
  currency: string;
  status: 'pending' | 'scheduled' | 'paid' | 'failed';
  scheduled_date: string | null;
  paid_date: string | null;
}

export interface PayoutDetail {
  id: number;
  reservation_id: number;
  listing: PayoutListing | null;
  reservation: {
    id: number;
    check_in: string;
    check_out: string;
    total_price: string;
    guests_count: number;
  } | null;
  gross_amount: number;
  cleaning_fee: number;
  commission_rate: number;
  commission_amount: number;
  taxes: number;
  net_amount: number;
  currency: string;
  status: string;
  scheduled_date: string | null;
  paid_date: string | null;
  reference: string | null;
  created_at: string;
}

export interface RevenueListingOption {
  id: number;
  title: string;
  city: string;
}

// ─── Host Revenue API ────────────────────────────────────────────────────────

export const hostRevenueApi = {
  getSummary: async (): Promise<RevenueSummary> => {
    return apiFetch<RevenueSummary>('/host/revenues/summary');
  },

  getChart: async (params?: { year?: number; listing_id?: number }): Promise<RevenueChartResponse> => {
    const query = new URLSearchParams();
    if (params?.year) query.append('year', String(params.year));
    if (params?.listing_id) query.append('listing_id', String(params.listing_id));
    const qs = query.toString();
    return apiFetch<RevenueChartResponse>(`/host/revenues/chart${qs ? `?${qs}` : ''}`);
  },

  getStats: async (): Promise<RevenueStats> => {
    return apiFetch<RevenueStats>('/host/revenues/stats');
  },

  getUpcoming: async (): Promise<{ payouts: Payout[] }> => {
    return apiFetch<{ payouts: Payout[] }>('/host/revenues/upcoming');
  },

  getHistory: async (params?: { year?: number; month?: number }): Promise<{ payouts: Payout[] }> => {
    const query = new URLSearchParams();
    if (params?.year) query.append('year', String(params.year));
    if (params?.month) query.append('month', String(params.month));
    const qs = query.toString();
    return apiFetch<{ payouts: Payout[] }>(`/host/revenues/history${qs ? `?${qs}` : ''}`);
  },

  getPayoutDetail: async (id: number): Promise<{ payout: PayoutDetail }> => {
    return apiFetch<{ payout: PayoutDetail }>(`/host/revenues/${id}`);
  },

  getListings: async (): Promise<{ listings: RevenueListingOption[] }> => {
    return apiFetch<{ listings: RevenueListingOption[] }>('/host/revenues/listings');
  },

  exportCSV: async (params?: { year?: number; month?: number }): Promise<Blob> => {
    const token = getAuthToken();
    const query = new URLSearchParams();
    if (params?.year) query.append('year', String(params.year));
    if (params?.month) query.append('month', String(params.month));
    const qs = query.toString();
    const response = await fetch(`${API_BASE_URL}/host/revenues/export${qs ? `?${qs}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/csv',
      },
    });
    return response.blob();
  },
};

// ─── Admin Hosts Types ──────────────────────────────────────────────────────

export interface AdminHost {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  phone: string | null;
  country: string | null;
  verified: boolean;
  properties: number;
  totalBookings: number;
  totalEarnings: string;
  totalEarningsValue: number;
  avgRating: number;
  joinDate: string;
  joinDateValue: number;
  status: 'ACTIF' | 'SUSPENDU' | 'BANNI';
  profile_photo_url: string | null;
}

export interface AdminHostsStats {
  totalHosts: number;
  totalActive: number;
  totalVerified: number;
  totalProperties: number;
  totalSuspended: number;
  countries: string[];
}

export interface AdminHostsResponse {
  hosts: AdminHost[];
  stats: AdminHostsStats;
}

// ─── Admin Host Detail Types ────────────────────────────────────────────────

export interface AdminHostDocument {
  name: string;
  date: string;
  status: string;
}

export interface AdminHostProperty {
  id: number;
  name: string;
  city: string;
  pricePerNight: string;
  status: string;
  rating: number;
  totalBookings: number;
  type: string;
}

export interface AdminHostStats {
  totalBookings: number;
  totalEarnings: string;
  totalEarningsValue: number;
  occupancyRate: string;
  avgRating: number;
  responseRate: string;
  cancellationRate: string;
  totalProperties: number;
  totalReviews: number;
}

export interface AdminHostBooking {
  property: string;
  guest: string;
  dates: string;
  amount: string;
  status: string;
}

export interface AdminHostPayment {
  id: string;
  property: string;
  amount: string;
  commission: string;
  net: string;
  date: string;
  status: string;
}

export interface AdminHostRefund {
  id: string;
  guest: string;
  amount: string;
  reason: string;
  date: string;
  status: string;
}

export interface AdminHostReview {
  guest: string;
  property: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AdminHostDispute {
  id: string;
  guest: string;
  property: string;
  reason: string;
  status: string;
  date: string;
}

export interface AdminHostSignal {
  id: string;
  type: string;
  reporter: string;
  description: string;
  date: string;
  status: string;
}

export interface AdminHostNote {
  id: number;
  author: string;
  date: string;
  content: string;
}

export interface AdminHostRisk {
  lastLogin: string;
  ip: string;
  device: string;
  fraudScore: number;
  accountAge: string;
}

export interface AdminHostDetail {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  verified: boolean;
  joinDate: string;
  language: string;
  status: 'ACTIF' | 'SUSPENDU' | 'BANNI';
  verificationDate: string | null;
  documents: AdminHostDocument[];
  addressVerified: boolean;
  bankVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  properties: AdminHostProperty[];
  stats: AdminHostStats;
  bookings: AdminHostBooking[];
  payments: AdminHostPayment[];
  refunds: AdminHostRefund[];
  reviews: AdminHostReview[];
  disputes: AdminHostDispute[];
  signals: AdminHostSignal[];
  notes: AdminHostNote[];
  risk: AdminHostRisk;
}

export interface AdminHostDetailResponse {
  host: AdminHostDetail;
}

// ─── Admin Hosts API ────────────────────────────────────────────────────────

export const adminHostsApi = {
  getAll: async (params?: {
    search?: string;
    status?: string;
    verified?: string;
    country?: string;
  }): Promise<AdminHostsResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.append(key, String(val));
      });
    }
    const qs = query.toString();
    return apiFetch<AdminHostsResponse>(`/admin/hosts${qs ? `?${qs}` : ''}`);
  },

  getOne: async (id: number): Promise<AdminHostDetailResponse> => {
    return apiFetch<AdminHostDetailResponse>(`/admin/hosts/${id}`);
  },

  suspend: async (id: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/hosts/${id}/suspend`, {
      method: 'POST',
    });
  },

  ban: async (id: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/hosts/${id}/ban`, {
      method: 'POST',
    });
  },

  activate: async (id: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/hosts/${id}/activate`, {
      method: 'POST',
    });
  },

  addNote: async (id: number, content: string): Promise<{ message: string; note: AdminHostNote }> => {
    return apiFetch<{ message: string; note: AdminHostNote }>(`/admin/hosts/${id}/note`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

// ─── Admin Clients Types ─────────────────────────────────────────────────────

export interface AdminClient {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  country: string;
  verified: boolean;
  totalBookings: number;
  totalSpent: string;
  totalSpentValue: number;
  joinDate: string;
  joinDateValue: number;
  averageRating: number;
  status: 'ACTIF' | 'SUSPENDU' | 'BANNI';
  isSuspect: boolean;
}

export interface AdminClientsStats {
  totalClients: number;
  totalActive: number;
  totalVerified: number;
  newThisMonth: number;
  totalSuspended: number;
  totalSuspect: number;
  countries: string[];
}

export interface AdminClientsResponse {
  clients: AdminClient[];
  stats: AdminClientsStats;
}

export interface AdminClientReview {
  id: number;
  hostName: string;
  hostAvatar: string;
  property: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AdminClientReport {
  id: number;
  reporter: string;
  reason: string;
  description: string;
  date: string;
  status: string;
}

export interface AdminClientActivityLog {
  id: number;
  action: string;
  detail: string;
  date: string;
  ip: string;
}

export interface AdminClientRefund {
  id: string;
  reservationId: string;
  amount: string;
  reason: string;
  status: string;
  date: string;
}

export interface AdminClientNote {
  id: number;
  author: string;
  date: string;
  content: string;
}

export interface AdminClientRisk {
  lastLogin: string;
  ip: string;
  device: string;
  fraudScore: number;
  loginCount: number;
  failedLogins: number;
}

export interface AdminClientDetail {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  country: string;
  verified: boolean;
  joinDate: string;
  language: string;
  status: 'ACTIF' | 'SUSPENDU' | 'BANNI';
  isSuspect: boolean;
  averageRating: number;
  totalSpent: string;
  verificationDate: string | null;
  documents: { name: string; date: string; status: string }[];
  totalBookings: number;
  cancellations: number;
  reviewsLeft: number;
  reviewsReceived: number;
  bookings: { property: string; host: string; dates: string; amount: string; status: string }[];
  payments: { id: string; amount: string; status: string; date: string }[];
  disputes: { id: string; property: string; status: string; date: string; description: string }[];
  reviews: AdminClientReview[];
  reports: AdminClientReport[];
  activityLog: AdminClientActivityLog[];
  refunds: AdminClientRefund[];
  notes: AdminClientNote[];
  risk: AdminClientRisk;
}

export interface AdminClientDetailResponse {
  client: AdminClientDetail;
}

// ─── Admin Clients API ───────────────────────────────────────────────────────

export const adminClientsApi = {
  getAll: async (params?: {
    search?: string;
    status?: string;
    verified?: string;
    country?: string;
    suspect?: string;
  }): Promise<AdminClientsResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.append(key, String(val));
      });
    }
    const qs = query.toString();
    return apiFetch<AdminClientsResponse>(`/admin/clients${qs ? `?${qs}` : ''}`);
  },

  getOne: async (id: number): Promise<AdminClientDetailResponse> => {
    return apiFetch<AdminClientDetailResponse>(`/admin/clients/${id}`);
  },

  suspend: async (id: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/clients/${id}/suspend`, {
      method: 'POST',
    });
  },

  ban: async (id: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/clients/${id}/ban`, {
      method: 'POST',
    });
  },

  activate: async (id: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/clients/${id}/activate`, {
      method: 'POST',
    });
  },

  toggleSuspect: async (id: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/clients/${id}/suspect`, {
      method: 'POST',
    });
  },

  addNote: async (id: number, content: string): Promise<{ message: string; note: AdminClientNote }> => {
    return apiFetch<{ message: string; note: AdminClientNote }>(`/admin/clients/${id}/note`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  delete: async (id: number): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>(`/admin/clients/${id}`, {
      method: 'DELETE',
    });
  },

  getMessages: async (id: number): Promise<AdminChatResponse> => {
    return apiFetch<AdminChatResponse>(`/admin/clients/${id}/messages`);
  },

  sendMessage: async (id: number, text: string): Promise<AdminSendMessageResponse> => {
    return apiFetch<AdminSendMessageResponse>(`/admin/clients/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};

export interface AdminChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_role: string;
  sender_name: string;
  text: string | null;
  image_url: string | null;
  read_at: string | null;
  created_at: string;
}

export interface AdminChatResponse {
  conversation_id: number | null;
  messages: AdminChatMessage[];
  is_admin_conversation: boolean;
}

export interface AdminSendMessageResponse {
  message: string;
  data: AdminChatMessage;
  conversation_id: number;
}
