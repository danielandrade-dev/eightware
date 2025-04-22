'use client';

import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from '../contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </CookiesProvider>
  );
} 