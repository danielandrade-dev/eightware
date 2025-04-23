'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, isAuthenticated, loading } = useAuth();
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
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    
    // Validação básica
    if (!name || !email || !password || !passwordConfirmation) {
      setGeneralError('Por favor, preencha todos os campos');
      return;
    }

    if (password !== passwordConfirmation) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Iniciando processo de criação de conta...');
      await signup(email, password, name);
      console.log('Conta criada com sucesso, redirecionando...');
      
      // Simplificar o redirecionamento para evitar problemas de tipagem
      // Usar um tempo de espera mais longo para garantir que o cookie seja configurado
      setIsLoading(true);
      console.log('Redirecionando após atraso...');
      
      // Redirecionamento com atraso maior
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err: unknown) {
      console.error('Erro ao criar conta:', err);
      
      // Verificar se temos o formato de erro específico do backend
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        
        // Verificar se temos o formato de erro específico do backend
        interface ErrorResponse {
          errors?: Record<string, string[]>;
        }
        
        const responseData = axiosError.response?.data as ErrorResponse;
        if (responseData && responseData.errors) {
          const errorData = responseData.errors;
          
          // Atribuir erros aos campos correspondentes
          if (errorData.name) {
            setNameError(errorData.name[0]);
          }
          
          if (errorData.email) {
            setEmailError(errorData.email[0]);
          }
          
          if (errorData.password) {
            setPasswordError(errorData.password[0]);
          }
          
          // Outros erros que não sejam específicos de um campo
          const otherErrors = Object.entries(errorData)
            .filter(([field]) => !['name', 'email', 'password'].includes(field))
            .flatMap(([field, messages]) => messages.map(msg => `${field}: ${msg}`));
            
          if (otherErrors.length > 0) {
            setGeneralError(otherErrors.join('\n'));
          }
        } else if (axiosError.response?.status === 422) {
          setGeneralError('Email já cadastrado ou inválido');
        } else {
          setGeneralError(`Erro: ${axiosError.message}`);
        }
      } else if (err instanceof Error) {
        setGeneralError(`Erro: ${err.message}`);
      } else {
        setGeneralError('Ocorreu um erro ao criar conta. Tente novamente.');
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
            Criar Conta
          </h2>
        </div>
        
        {generalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {generalError.split('\n').map((line, index) => (
              <div key={index}>
                {line}
                {index < generalError.split('\n').length - 1 && <br />}
              </div>
            ))}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  nameError ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-600">{nameError}</p>
              )}
            </div>

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
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  emailError ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
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
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  passwordError ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password-confirmation" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <input
                id="password-confirmation"
                name="password-confirmation"
                type="password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
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
              ) : 'Criar Conta'}
            </button>

            <Link 
              href="/login" 
              className="w-full flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Já tenho uma conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 