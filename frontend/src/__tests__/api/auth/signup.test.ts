import { POST } from '@/app/api/auth/signup/route';

interface SignupRequestBody {
  email: string;
  password: string;
  password_confirmation: string;
}

describe('Signup API Route', () => {
  const mockRequest = (body: SignupRequestBody) => {
    return new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  it('should return 201 for successful signup', async () => {
    const request = mockRequest({
      email: 'newuser@example.com',
      password: 'password123',
      password_confirmation: 'password123',
    });

    // Mock fetch para simular sucesso
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'mock-token' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });

  it('should return 422 for invalid data', async () => {
    const request = mockRequest({
      email: 'invalid-email',
      password: '123',
      password_confirmation: '123',
    });

    // Mock fetch para simular erro de validação
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ errors: ['Email inválido'] }),
    });

    const response = await POST(request);
    expect(response.status).toBe(422);
  });

  it('should return 500 for server error', async () => {
    const request = mockRequest({
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
    });

    // Mock fetch para simular erro
    global.fetch = jest.fn().mockRejectedValue(new Error('Server error'));

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
}); 