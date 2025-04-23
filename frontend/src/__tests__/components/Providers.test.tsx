import { render } from '@testing-library/react';
import { Providers } from '../../components/Providers';

// Mock dos providers
jest.mock('react-cookie', () => ({
  CookiesProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cookies-provider">{children}</div>
  )
}));

jest.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  )
}));

describe('Providers', () => {
  it('deve renderizar corretamente com os providers aninhados', () => {
    // arrange
    const testChild = <div data-testid="test-child">Conteúdo de teste</div>;
    
    // act
    const { getByTestId } = render(
      <Providers>{testChild}</Providers>
    );
    
    // assert
    // Verifica se os providers estão aninhados corretamente
    const cookiesProvider = getByTestId('cookies-provider');
    const authProvider = getByTestId('auth-provider');
    const child = getByTestId('test-child');
    
    expect(cookiesProvider).toBeInTheDocument();
    expect(authProvider).toBeInTheDocument();
    expect(child).toBeInTheDocument();
    
    // Verifica a hierarquia correta de aninhamento
    expect(cookiesProvider).toContainElement(authProvider);
    expect(authProvider).toContainElement(child);
  });
}); 