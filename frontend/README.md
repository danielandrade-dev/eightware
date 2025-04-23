# EightWare Frontend

Este é o frontend da aplicação EightWare, desenvolvido com [Next.js](https://nextjs.org) utilizando TypeScript e as versões mais recentes de React (19).

## Tecnologias Principais

- **Next.js 15.3.0** - Framework React com suporte a SSR, rotas e API
- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **TailwindCSS 4** - Framework CSS utility-first
- **Axios** - Cliente HTTP para requisições à API
- **React Cookie** - Gerenciamento de cookies para autenticação
- **Jest** - Framework de testes
- **Testing Library** - Biblioteca para testes de componentes React

## Iniciando o Projeto

Para executar o servidor de desenvolvimento com TurboPack (para melhor performance):

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/             # Páginas e rotas da aplicação (Next.js App Router)
│   │   ├── login/       # Página de login
│   │   ├── signup/      # Página de cadastro
│   │   ├── profile/     # Área logada do usuário
│   │   └── api/         # Rotas de API do Next.js
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos React (AuthContext para autenticação)
│   ├── hooks/           # Hooks personalizados (useAuth)
│   ├── types/           # Definições de tipos TypeScript
│   └── __tests__/       # Testes automatizados
│       ├── components/  # Testes de componentes
│       ├── contexts/    # Testes de contextos
│       ├── api/         # Testes das rotas de API
│       └── hooks/       # Testes de hooks
├── public/              # Arquivos estáticos
└── ...
```

## Funcionalidades Principais

### Sistema de Autenticação

- Registro de usuários (signup)
- Login com token JWT
- Proteção de rotas para usuários autenticados
- Persistência de sessão com cookies
- Gerenciamento centralizado de estado de autenticação

### Arquitetura de Contexto React

O projeto utiliza a Context API do React para gerenciar o estado global de autenticação, permitindo:

- Acesso ao estado do usuário em qualquer componente
- Métodos para login, signup e logout
- Verificação automática do estado de autenticação

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com TurboPack
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter para verificar problemas de código
- `npm test` - Executa todos os testes
- `npm test -- --watch` - Executa os testes em modo watch
- `npm test -- --coverage` - Executa os testes e gera relatório de cobertura

## Conexão com o Backend

A aplicação se conecta a uma API backend através do Axios. Por padrão, o endereço da API é configurado para `http://localhost:3001`, mas pode ser alterado através da variável de ambiente `NEXT_PUBLIC_API_URL`.

## Testes

O projeto utiliza Jest e React Testing Library para testes. Os testes seguem os padrões definidos no documento de referência `300_testing_standards.mdc`.

### Estrutura dos Testes

Os testes seguem a estrutura:

```typescript
describe('Component', () => {
  it('should render correctly', () => {
    // arrange - configuração do teste
    // act - execução da ação a ser testada
    // assert - verificação dos resultados esperados
  });
});
```

### Padrões de Testes

- **Testes de Componentes**: Testam a renderização e interação com os componentes
- **Testes de Hooks**: Testam o comportamento dos hooks personalizados
- **Testes de Contextos**: Testam o provedor de contexto e seus valores/funções
- **Testes de API**: Testam as rotas da API do Next.js

### Executando Testes Específicos

Você pode executar testes específicos usando os seguintes comandos:

```bash
# Testar apenas componentes
npm test -- src/__tests__/components/

# Testar apenas contextos
npm test -- src/__tests__/contexts/

# Testar um arquivo específico
npm test -- src/__tests__/components/LoginForm.test.tsx
```

### Mocks

Os testes utilizam mocks para isolar o comportamento dos componentes e funções:

- Mock de serviços de API
- Mock de contextos
- Mock de cookies e localStorage
- Mock de funções do Next.js

---
