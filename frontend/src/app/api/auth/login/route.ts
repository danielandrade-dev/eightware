import { NextResponse } from 'next/server';

// Obter a URL da API da variável de ambiente ou usar valor padrão
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3443';

export async function POST(request: Request) {
  try {
    console.log(`Chamando API de login com URL base: ${API_URL}`);
    
    const body = await request.json();
    const { email, password } = body;

    // Não precisamos mais substituir https por http
    console.log(`URL final para login: ${API_URL}/login`);

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.error(`Erro na resposta do login: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const data = await response.json();
    console.log('Login bem-sucedido, dados recebidos');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Erro ao processar login: ${error}`);
    return NextResponse.json(
      { error: 'Erro interno do servidor ' + error },
      { status: 500 }
    );
  }
} 