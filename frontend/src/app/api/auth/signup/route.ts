import { NextResponse } from 'next/server';

// Obter a URL da API da variável de ambiente ou usar valor padrão
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3443';

interface SignupRequestBody {
  email: string;
  password: string;
  password_confirmation: string;
}

export async function POST(request: Request) {
  try {
    console.log(`Chamando API de signup com URL base: ${API_URL}`);
    
    const body = await request.json();
    const { email, password, password_confirmation } = body as SignupRequestBody;

    // Validação básica
    if (password !== password_confirmation) {
      console.warn('Senhas não coincidem na requisição de signup');
      return NextResponse.json(
        { error: 'As senhas não coincidem' },
        { status: 422 }
      );
    }

    // Não precisamos mais substituir https por http
    console.log(`URL final para signup: ${API_URL}/signup`);

    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { email, password, password_confirmation } }),
    });

    if (!response.ok) {
      console.error(`Erro na resposta do signup: ${response.status} ${response.statusText}`);
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Erro ao criar conta' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Signup bem-sucedido, conta criada');
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(`Erro ao processar signup: ${error}`);
    return NextResponse.json(
      { error: 'Erro interno do servidor' + error },
      { status: 500 }
    );
  }
} 