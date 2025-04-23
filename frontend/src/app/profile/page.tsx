'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('Não autenticado, redirecionando para login');
      router.push('/login');
    }
    if (!loading && isAuthenticated && user) {
      console.log('Usuário autenticado:', user);
    }
  }, [loading, isAuthenticated, router, user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    console.log('Iniciando processo de logout...');
    
    try {
      await logout();
      console.log('Logout realizado, aguardando para redirecionar...');
      
      // Adicionando um pequeno atraso para garantir que o estado seja limpo
      setTimeout(() => {
        console.log('Redirecionando para página de login...');
        router.push('/login');
      }, 800);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, tenta redirecionar
      setTimeout(() => {
        router.push('/login');
      }, 800);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-32 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="bg-white p-1 rounded-full shadow-lg">
                <UserCircleIcon className="h-32 w-32 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="pt-20 pb-8 px-6 sm:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Perfil do Usuário
              </h2>
              <p className="mt-2 text-gray-500">
                Gerencie suas informações pessoais
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Nome
                    </label>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-900">{user?.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      ID do Usuário
                    </label>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span className="text-gray-900">{user?.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  isLoggingOut ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saindo...
                  </>
                ) : (
                  <>
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Sair da Conta
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 