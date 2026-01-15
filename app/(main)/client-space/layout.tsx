'use client';

import { ReactNode } from 'react';

interface ClientSpaceLayoutProps {
  children: ReactNode;
}

/**
 * Client Space Layout - Pass-through layout for the client space
 * The ClientSpace component handles its own layout, header, and sidebar
 */
export default function ClientSpaceLayout({ children }: ClientSpaceLayoutProps) {
  // Simply render children - the ClientSpace component handles everything
  return <>{children}</>;
}

