import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { useAuth as useAuthService } from '../services/auth';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with no user and loading state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should handle login successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const success = await result.current.login('test@example.com', 'password');
      expect(success).toBe(true);
    });
    
    expect(result.current.user).not.toBeNull();
  });

  it('should handle logout', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
  });
}); 