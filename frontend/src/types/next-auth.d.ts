declare module '@/app/api/auth/profile/route' {
  export function GET(request: Request): Promise<Response>;
}

declare module '@/app/api/auth/signup/route' {
  export function POST(request: Request): Promise<Response>;
} 

declare module '@/app/api/auth/login/route' {
  export function POST(request: Request): Promise<Response>;
} 
