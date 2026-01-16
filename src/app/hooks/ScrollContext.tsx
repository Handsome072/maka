'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface ScrollContextType {
  isScrolled: boolean;
  setIsScrolled: (value: boolean) => void;
  scrollListenerEnabled: React.MutableRefObject<boolean>;
  handleNavigateScroll: () => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

interface ScrollProviderProps {
  children: ReactNode;
}

export function ScrollProvider({ children }: ScrollProviderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollListenerEnabled = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollListenerEnabled.current) return;
      
      const scrollY = window.scrollY;
      
      setIsScrolled((prevScrolled) => {
        // Hysteresis: small buffer to prevent flickering while staying responsive
        // Switch to compact when scrollY > 50 (triggers early for snappy feel)
        // Switch back to normal when scrollY < 20 (returns quickly when near top)
        // 30px buffer zone (20-50) where state doesn't change
        if (!prevScrolled && scrollY > 50) {
          return true;
        } else if (prevScrolled && scrollY < 20) {
          return false;
        }
        return prevScrolled;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigateScroll = () => {
    // Disable scroll listener during navigation
    scrollListenerEnabled.current = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsScrolled(false);
    
    // Re-enable after a short delay
    setTimeout(() => {
      scrollListenerEnabled.current = true;
    }, 100);
  };

  return (
    <ScrollContext.Provider value={{ isScrolled, setIsScrolled, scrollListenerEnabled, handleNavigateScroll }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}

// Alias pour compatibilité avec l'ancien projet
export const useScrollContext = useScroll;

