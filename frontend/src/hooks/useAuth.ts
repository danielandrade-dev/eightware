'use client'
import axios from 'axios';
import { useCookies } from 'react-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface SignUpData {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
}

export const useAuth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para adicionar o token JWT em todas as requisições
  api.interceptors.request.use((config) => {
    const token = cookies.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const signup = async (data: SignUpData) => {
    const response = await api.post('/signup', { user: data });
    if (response.data.token) {
      setCookie('token', response.data.token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, 
      });
    }
    return response.data;
  };

  const login = async (data: LoginData) => {
    const response = await api.post('/login', data);
    if (response.data.token) {
      setCookie('token', response.data.token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, 
      });
    }
    return response.data;
  };

  const getMe = async () => {
    const response = await api.get('/me');
    return response.data;
  };

  const logout = () => {
    removeCookie('token');
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