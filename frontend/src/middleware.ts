import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Rotas que requerem autenticação
  const protectedRoutes = ['/profile'];

  // Se a rota requer autenticação e não há token, redireciona para login
  if (protectedRoutes.includes(pathname) && !token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Se o usuário está autenticado e tenta acessar login/signup, redireciona para profile
  if (token && (pathname === '/login' || pathname === '/signup')) {
    const url = new URL('/profile', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/login', '/signup'],
}; 