'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log('Usuário já autenticado, redirecionando para o perfil');
      router.push('/profile');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      console.log('Iniciando processo de login...');
      // Aumentar o timeout para garantir que há tempo suficiente para processar o login
      const user = await login(email, password);
      console.log('Login concluído com sucesso, usuário:', user);
      
      // Redirecionamento com atraso maior
      setTimeout(() => {
        console.log('Redirecionando para página de perfil...');
        router.push('/profile');
      }, 800);
    } catch (err: unknown) {
      console.error('Erro ao fazer login:', err);
      
      // Mensagens de erro mais específicas
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          setError('Email ou senha incorretos');
        } else if (axiosError.response?.status === 404) {
          setError('Usuário não encontrado');
        } else {
          setError(`Erro: ${axiosError.message}`);
        }
      } else if (err instanceof Error) {
        if (err.message.includes('Token não encontrado')) {
          setError('Erro de autenticação. Por favor, tente novamente.');
          // Tentar limpar os cookies para um novo login limpo
          document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.split('=');
            document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          });
        } else {
          setError(`Erro: ${err.message}`);
        }
      } else {
        setError('Ocorreu um erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entrar
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Processando...
                </>
              ) : 'Entrar'}
            </button>

            <Link 
              href="/signup" 
              className="w-full flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Criar Conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 