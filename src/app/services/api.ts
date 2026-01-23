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
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<MessageResponse> => {
    return apiFetch<MessageResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

