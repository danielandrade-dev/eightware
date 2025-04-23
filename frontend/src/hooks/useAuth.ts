'use client'
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface SignUpData {
  email: string;
  password: string;
  password_confirmation: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

// Criar a instância do axios fora do hook para evitar recriação
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar um interceptor global
const setupGlobalInterceptor = (token: string | null) => {
  // Configura o header globalmente
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const useAuth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  
  // Atualiza o header quando o token mudar
  useEffect(() => {
    setupGlobalInterceptor(cookies.token);
  }, [cookies.token]);

  const signup = async (data: SignUpData) => {
    try {
      const response = await api.post('/signup', { user: data });
      if (response.data.token) {
        // Configurar o cookie com o token
        setCookie('token', response.data.token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          path: '/',
        });
        
        // Configurar o token diretamente no header da API
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        console.log('Token definido após signup:', response.data.token);
        
        // Aguarda um pouco para garantir que o cookie foi definido
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return {
          ...response.data,
          // Incluir o token na resposta para uso imediato
          currentToken: response.data.token
        };
      }
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  };

  const login = async (data: LoginData) => {
    try {
      // Limpar qualquer token anterior para evitar problemas
      removeCookie('token', { path: '/' });
      
      // Remover o header de autorização antes de fazer login
      delete api.defaults.headers.common['Authorization'];
      
      // Fazer a requisição de login
      const response = await api.post('/login', data);
      
      // Verificar se temos um token na resposta
      if (response.data && response.data.token) {
        // Configurar o cookie com o token
        setCookie('token', response.data.token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          path: '/',
        });
        
        // Configurar o token diretamente no header da API
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        console.log('Token definido:', response.data.token);
        
        // Aguarda um pouco para garantir que o cookie foi definido
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return {
          ...response.data,
          // Incluir o token na resposta para uso imediato
          currentToken: response.data.token
        };
      } else {
        throw new Error('Token não encontrado na resposta');
      }
    } catch (error) {
      console.error('Erro na função login:', error);
      throw error;
    }
  };

  const getMe = async (tokenOverride?: string) => {
    try {
      // Usar o token passado como parâmetro ou pegar do cookie
      const token = tokenOverride || getToken();
      
      if (!token) {
        console.warn('Token não encontrado ao buscar dados do usuário. O cookie pode não estar definido ainda.');
        return null; // Retornar null em vez de lançar erro
      }
      
      // Garantir que o token está nos headers para esta requisição específica
      const response = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null; // Retornar null em vez de lançar erro
    }
  };

  const logout = async () => {
    try {
      // Limpar cookie
      removeCookie('token', { path: '/' });
      
      // Limpar headers
      delete api.defaults.headers.common['Authorization'];
      
      // Simular atraso para melhor experiência do usuário
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Logout completo, tokens e headers limpos');
      return true;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const getToken = () => {
    return cookies.token;
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  return {
    signup,
    login,
    getMe,
    logout,
    getToken,
    isAuthenticated,
  };
}; 