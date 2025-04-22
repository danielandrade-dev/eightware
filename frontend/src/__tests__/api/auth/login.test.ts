import { POST } from '@/app/api/auth/login/route';

interface LoginRequestBody {
  email: string;
  password: string;
}

describe('Login API Route', () => {
  const mockRequest = (body: LoginRequestBody) => {
    return new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  it('should return 401 for invalid credentials', async () => {
    const request = mockRequest({
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('should return 500 for server error', async () => {
    const request = mockRequest({
      email: 'test@example.com',
      password: 'password',
    });

    // Mock fetch para simular erro
    global.fetch = jest.fn().mockRejectedValue(new Error('Server error'));

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
}); 