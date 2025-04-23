import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // Aplicar a todas as rotas
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
  // Definir variáveis de ambiente públicas
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3443',
  },
  // Configurações para HTTPS
  serverRuntimeConfig: {
    https: {
      rejectUnauthorized: false, // Aceitar certificados auto-assinados
    },
  },
};

export default nextConfig;
