'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApi, User as ApiUser, getAuthToken, removeAuthToken } from '../services/api';

// User interface that includes both old format (for backward compatibility) and new API format
export interface User {
  id?: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  email_verified?: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithUser: (user: User) => void; // For social login backward compatibility
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birth_date?: string;
    receive_marketing?: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key for user data
const USER_STORAGE_KEY = 'homiqio_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert API user to local user format
  const apiUserToUser = (apiUser: ApiUser): User => ({
    id: apiUser.id,
    name: `${apiUser.first_name} ${apiUser.last_name}`.trim(),
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    email: apiUser.email,
    email_verified: apiUser.email_verified,
  });

  // Load user from storage and validate token on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getAuthToken();
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (token && storedUser) {
          // Try to validate token by fetching user
          try {
            const response = await authApi.getUser();
            const userData = apiUserToUser(response.user);
            setUser(userData);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
          } catch {
            // Token is invalid, clear storage
            removeAuthToken();
            localStorage.removeItem(USER_STORAGE_KEY);
          }
        }
      } catch {
        // Ignore errors during init
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(email, password);
      const userData = apiUserToUser(response.user);
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (err: any) {
      const message = err.message || 'Erreur de connexion';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Backward compatibility for social login
  const loginWithUser = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }, []);

  const register = useCallback(async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birth_date?: string;
    receive_marketing?: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      const userData = apiUserToUser(response.user);
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (err: any) {
      const message = err.data?.message || err.message || 'Erreur lors de l\'inscription';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      removeAuthToken();
      localStorage.removeItem(USER_STORAGE_KEY);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.getUser();
      const userData = apiUserToUser(response.user);
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch {
      // Ignore refresh errors
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        loginWithUser,
        register,
        logout,
        clearError,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
