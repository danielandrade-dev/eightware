import { NextResponse } from 'next/server';

interface SignupRequestBody {
  email: string;
  password: string;
  password_confirmation: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, password_confirmation } = body as SignupRequestBody;

    // Validação básica
    if (password !== password_confirmation) {
      return NextResponse.json(
        { error: 'As senhas não coincidem' },
        { status: 422 }
      );
    }

    const response = await fetch('http://localhost:3001/api/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { email, password, password_confirmation } }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Erro ao criar conta' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' + error },
      { status: 500 }
    );
  }
} 