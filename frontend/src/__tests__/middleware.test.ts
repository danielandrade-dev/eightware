import { middleware } from '../middleware';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

describe('Middleware', () => {
  const mockRequest = (path: string, token?: string) => {
    const headers = new Headers();
    if (token) {
      headers.append('Cookie', `token=${token}`);
    }
    return {
      nextUrl: {
        pathname: path,
      },
      cookies: {
        get: () => token ? { value: token } : undefined,
      },
      url: 'http://localhost:3000',
    } as unknown as NextRequest;
  };

  it('should redirect to login when accessing profile without token', () => {
    const request = mockRequest('/profile');
    const response = middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('should allow access to profile with valid token', () => {
    const request = mockRequest('/profile', 'valid-token');
    const response = middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get('location')).toBeNull();
  });

  it('should redirect to profile when accessing login with token', () => {
    const request = mockRequest('/login', 'valid-token');
    const response = middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get('location')).toBe('http://localhost:3000/profile');
  });

  it('should allow access to login without token', () => {
    const request = mockRequest('/login');
    const response = middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get('location')).toBeNull();
  });
}); 