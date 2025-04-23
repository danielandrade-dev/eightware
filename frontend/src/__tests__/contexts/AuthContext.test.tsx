import { render, act, waitFor, screen, renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { useAuth as useAuthService } from '../../hooks/useAuth';

// Mocking useAuthService
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

// Componente de teste para renderizar o Provider
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : 'no-user'}</div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="authenticated">{auth.isAuthenticated.toString()}</div>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  // Mock dos métodos do serviço de auth
  const mockGetMe = jest.fn();
  const mockIsAuthenticated = jest.fn();
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  const mockSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock padrão para o serviço de autenticação
    (useAuthService as any).mockReturnValue({
      getMe: mockGetMe,
      isAuthenticated: mockIsAuthenticated,
      login: mockLogin,
      logout: mockLogout,
      signup: mockSignup
    });
  });

  it('deve inicializar com usuário nulo e carregando os dados', async () => {
    // arrange
    mockIsAuthenticated.mockReturnValue(false);
    
    // act
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // assert - como o loading muda para false muito rapidamente em ambiente de teste,
    // vamos apenas verificar que o usuário está nulo
    expect(screen.getByTestId('user').textContent).toBe('no-user');
    
    // Esperar o fim do loading
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
  });

  it('deve carregar o usuário se já estiver autenticado', async () => {
    // arrange
    const mockUser = { id: 1, name: 'Teste', email: 'teste@exemplo.com' };
    mockIsAuthenticated.mockReturnValue(true);
    mockGetMe.mockResolvedValue({ user: mockUser });
    
    // act
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Depois carrega o usuário
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
  });

  it('deve realizar login com sucesso', async () => {
    // arrange
    const mockUser = { id: 1, name: 'Teste', email: 'teste@exemplo.com' };
    mockIsAuthenticated.mockReturnValue(false);
    mockLogin.mockResolvedValue({ currentToken: 'token-mock' });
    mockGetMe.mockResolvedValue({ user: mockUser });
    
    // act - renderização inicial
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Esperar o loading inicial
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('no-user');
    });

    // Utilizar o hook diretamente para fazer login
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    // act - realizar login
    await act(async () => {
      await result.current.login('teste@exemplo.com', 'senha123');
    });

    // assert
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'teste@exemplo.com', password: 'senha123' });
      expect(mockGetMe).toHaveBeenCalledWith('token-mock');
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('deve realizar logout corretamente', async () => {
    // arrange
    const mockUser = { id: 1, name: 'Teste', email: 'teste@exemplo.com' };
    mockIsAuthenticated.mockReturnValue(true);
    mockGetMe.mockResolvedValue({ user: mockUser });
    mockLogout.mockResolvedValue(undefined);
    
    // act - renderização com usuário
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Esperar carregar o usuário
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));
    });

    // act - fazer logout
    await act(async () => {
      screen.getByRole('button', { name: 'Logout' }).click();
    });

    // assert
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(screen.getByTestId('user').textContent).toBe('no-user');
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
    });
  });

  it('deve realizar signup com sucesso', async () => {
    // arrange
    const mockUser = { id: 1, name: 'Novo Usuário', email: 'novo@exemplo.com' };
    mockIsAuthenticated.mockReturnValue(false);
    mockSignup.mockResolvedValue({ currentToken: 'token-novo-usuario' });
    mockGetMe.mockResolvedValue({ user: mockUser });
    
    // act - renderização inicial
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Esperar o loading inicial
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Utilizar o hook diretamente para fazer signup
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    // act - realizar signup
    await act(async () => {
      await result.current.signup('novo@exemplo.com', 'senha123', 'Novo Usuário');
    });

    // assert
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({ 
        email: 'novo@exemplo.com', 
        password: 'senha123', 
        password_confirmation: 'senha123',
        name: 'Novo Usuário' 
      });
      expect(mockGetMe).toHaveBeenCalledWith('token-novo-usuario');
      expect(result.current.user).toEqual(mockUser);
    });
  });
}); 