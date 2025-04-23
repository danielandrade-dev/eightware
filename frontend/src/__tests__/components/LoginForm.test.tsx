import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../../components/LoginForm';
import { useAuth } from '../../contexts/AuthContext';

// Mock do contexto de autenticação
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as any).mockReturnValue({
      login: mockLogin
    });
  });
  
  it('deve renderizar corretamente', () => {
    // arrange
    render(<LoginForm />);
    
    // assert
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });
  
  it('deve chamar a função login quando o formulário for submetido', async () => {
    // arrange
    render(<LoginForm />);
    
    // act
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'usuario@exemplo.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    
    // assert
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('usuario@exemplo.com', 'senha123');
    });
  });
  
  it('deve exibir mensagem de erro quando o login falhar', async () => {
    // arrange
    mockLogin.mockRejectedValue(new Error('Falha no login'));
    render(<LoginForm />);
    
    // act
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'usuario@exemplo.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha_errada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    
    // assert
    await waitFor(() => {
      expect(screen.getByText('Email ou senha inválidos')).toBeInTheDocument();
    });
  });
  
  it('deve limpar a mensagem de erro ao tentar novamente', async () => {
    // arrange
    mockLogin.mockRejectedValueOnce(new Error('Falha no login'));
    render(<LoginForm />);
    
    // act - primeiro login com falha
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'usuario@exemplo.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha_errada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    
    // esperar pelo erro
    await waitFor(() => {
      expect(screen.getByText('Email ou senha inválidos')).toBeInTheDocument();
    });
    
    // act - segunda tentativa
    mockLogin.mockResolvedValueOnce(undefined);
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    
    // assert
    await waitFor(() => {
      expect(screen.queryByText('Email ou senha inválidos')).not.toBeInTheDocument();
    });
  });
}); 