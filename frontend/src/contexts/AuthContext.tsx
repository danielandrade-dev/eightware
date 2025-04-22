import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth as useAuthService, User } from '../services/auth';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuthService();

  const loadUser = useCallback(async () => {
    try {
      if (auth.isAuthenticated()) {
        const userData = await auth.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      auth.logout();
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function signup(email: string, password: string) {
    await auth.signup({ email, password, password_confirmation: password });
    await loadUser();
  }

  async function login(email: string, password: string) {
    await auth.login({ email, password });
    await loadUser();
  }

  function logout() {
    auth.logout();
    setUser(null);
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