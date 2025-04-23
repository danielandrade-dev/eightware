'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth as useAuthService, User } from '../hooks/useAuth';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuthService();

  // Carregar usuário apenas uma vez na montagem do componente
  useEffect(() => {
    let isMounted = true;
    
    const loadUser = async () => {
      try {
        // Adicionar uma flag para evitar múltiplas chamadas
        console.log("Verificando autenticação - inicio do loadUser");
        
        if (auth.isAuthenticated()) {
          console.log('Token encontrado, carregando usuário...');
          
          try {
            const userData = await auth.getMe();
            // Verificar se o componente ainda está montado antes de atualizar o estado
            if (isMounted) {
              if (userData && userData.user) {
                setUser(userData.user);
                console.log('Usuário carregado com sucesso inicial');
              } else {
                console.warn('Dados do usuário inválidos');
                auth.logout();
              }
            }
          } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            if (isMounted) {
              auth.logout();
            }
          }
        } else {
          console.log('Nenhum token encontrado, usuário não autenticado');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    console.log('AuthProvider montado - verificando autenticação');
    loadUser();
    
    // Função de limpeza para evitar atualização de estado em componente desmontado
    return () => {
      isMounted = false;
    };
  }, []); // Removido auth das dependências para evitar reexecução

  async function signup(email: string, password: string, name?: string) {
    setLoading(true);
    try {
      const signupResponse = await auth.signup({ 
        email, 
        password, 
        password_confirmation: password,
        name 
      });
      
      console.log('Conta criada com sucesso, token recebido');
      
      // Verificar se temos um token na resposta
      if (signupResponse && signupResponse.currentToken) {
        // Obter o token retornado diretamente da API
        const currentToken = signupResponse.currentToken;
        
        // Depois buscar dados do usuário usando o token recebido
        try {
          console.log('Buscando dados do usuário após signup usando token direto...', currentToken);
          const userData = await auth.getMe(currentToken);
          if (userData && userData.user) {
            setUser(userData.user);
            console.log('Usuário carregado com sucesso após signup:', userData.user);
          } else {
            console.warn('Dados do usuário inválidos após signup');
            // Não lançar erro aqui, apenas logar o aviso
          }
        } catch (userError) {
          console.error('Erro ao carregar dados do usuário após signup:', userError);
          // Não propagamos este erro, apenas registramos, pois o signup já ocorreu com sucesso
          // O usuário ainda pode entrar no sistema, apenas não carregamos os dados iniciais
        }
      } else {
        console.warn('Token não recebido na resposta de signup, o usuário precisará fazer login manualmente');
      }
      
      return signupResponse; // Retornar a resposta para a página de signup continuar o fluxo
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      // Primeiro realizar o login
      const loginResponse = await auth.login({ email, password });
      console.log('Login realizado com sucesso, token recebido');
      
      // Obter o token retornado diretamente da API
      const currentToken = loginResponse.currentToken;
      
      // Depois buscar dados do usuário usando o token recebido
      try {
        console.log('Buscando dados do usuário após login usando token direto...');
        const userData = await auth.getMe(currentToken);
        if (userData && userData.user) {
          setUser(userData.user);
          console.log('Usuário carregado com sucesso após login:', userData.user);
          return userData.user;
        } else {
          throw new Error('Dados do usuário inválidos');
        }
      } catch (userError) {
        console.error('Erro ao carregar dados do usuário após login:', userError);
        throw userError;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await auth.logout();
      // Limpar o estado do usuário no contexto
      setUser(null);
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 