import { NextResponse } from 'next/server';

// Obter a URL da API da variável de ambiente ou usar valor padrão
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3443';

export async function GET(request: Request) {
  try {
    console.log(`Chamando API de perfil com URL base: ${API_URL}`);
    
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Token não fornecido na requisição de perfil');
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Não precisamos mais substituir https por http
    console.log(`URL final para perfil: ${API_URL}/me`);

    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Erro na resposta do perfil: ${response.status} ${response.statusText}`);
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Erro ao buscar dados do usuário' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Dados de perfil recebidos com sucesso');
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Erro ao processar perfil: ${error}`);
    return NextResponse.json(
      { error: 'Erro interno do servidor' + error },
      { status: 500 }
    );
  }
} 