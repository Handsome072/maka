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
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  email_verified: boolean;
  birth_date?: string;
  receive_marketing?: boolean;
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

