'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { useHostOnboardingState } from './useHostOnboardingState';

type HostOnboardingState = ReturnType<typeof useHostOnboardingState>;

const HostOnboardingContext = createContext<HostOnboardingState | null>(null);

export function useHostOnboarding() {
  const ctx = useContext(HostOnboardingContext);
  if (!ctx) throw new Error('useHostOnboarding must be used within HostOnboardingProvider');
  return ctx;
}

interface HostOnboardingProviderProps {
  value: HostOnboardingState;
  children: ReactNode;
}

export function HostOnboardingProvider({ value, children }: HostOnboardingProviderProps) {
  return (
    <HostOnboardingContext.Provider value={value}>
      {children}
    </HostOnboardingContext.Provider>
  );
}
