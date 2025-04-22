import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/signup');
  const isProfilePage = request.nextUrl.pathname.startsWith('/profile');

  // Se estiver na página de autenticação e já tiver token, redireciona para o profile
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Se estiver na página de profile e não tiver token, redireciona para o login
  if (isProfilePage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/login', '/signup'],
}; 