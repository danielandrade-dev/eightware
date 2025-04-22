import { GET } from '@/app/api/auth/profile/route';

describe('Profile API Route', () => {
  const mockRequest = (token?: string) => {
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    return new Request('http://localhost:3000/api/auth/profile', {
      method: 'GET',
      headers,
    });
  };

  it('should return 401 for missing token', async () => {
    const request = mockRequest();
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('should return 401 for invalid token', async () => {
    const request = mockRequest('invalid-token');
    
    // Mock fetch para simular token inválido
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Token inválido' }),
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('should return user data for valid token', async () => {
    const request = mockRequest('valid-token');
    
    // Mock fetch para simular sucesso
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        email: 'user@example.com',
      }),
    });

    const response = await GET(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('email');
  });

  it('should return 500 for server error', async () => {
    const request = mockRequest('valid-token');
    
    // Mock fetch para simular erro
    global.fetch = jest.fn().mockRejectedValue(new Error('Server error'));

    const response = await GET(request);
    expect(response.status).toBe(500);
  });
}); 