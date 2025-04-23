import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obter o token do cookie
  const token = request.cookies.get('token')?.value;
  
  // Verificar se estamos em uma página de autenticação ou na área protegida
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/signup');
  const isProfilePage = request.nextUrl.pathname.startsWith('/profile');
  
  // Para debugging - isso aparecerá nos logs do servidor
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Token: ${token ? 'Presente' : 'Ausente'}`);

  // Se estiver na página de autenticação e já tiver token, redireciona para o profile
  if (isAuthPage && token) {
    console.log('[Middleware] Redirecionando de página de auth para profile');
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Se estiver na página de profile e não tiver token, redireciona para o login
  if (isProfilePage && !token) {
    console.log('[Middleware] Redirecionando de profile para login (não autenticado)');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Continue com a requisição normal
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/login', '/signup'],
}; 