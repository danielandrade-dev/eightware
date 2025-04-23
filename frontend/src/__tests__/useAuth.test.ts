import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { useAuth as useAuthService } from '../services/auth';
import { CookiesProvider } from 'react-cookie';
import React from 'react';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Wrapper com CookiesProvider para o renderHook
const CookieWrapper = ({ children }: { children: React.ReactNode }) => (
  <CookiesProvider>{children}</CookiesProvider>
);

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with no user and loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: CookieWrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should handle login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: CookieWrapper });
    
    await act(async () => {
      const success = await result.current.login('test@example.com', 'password');
      expect(success).toBe(true);
    });
    
    expect(result.current.user).not.toBeNull();
  });

  it('should handle logout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: CookieWrapper });
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
  });
}); 