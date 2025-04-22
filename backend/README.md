# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

# API Documentation

## Autenticação

Todos os endpoints protegidos requerem um token JWT no header da requisição:
```
Authorization: Bearer <token>
```

## Endpoints

### Autenticação

#### POST /signup
Cria uma nova conta de usuário.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "Senha123",
  "name": "Nome do Usuário" // opcional
}
```

**Respostas:**
- 201 Created: Conta criada com sucesso
  ```json
  {
    "user": {
      "id": 1,
      "email": "usuario@exemplo.com",
      "name": "Nome do Usuário",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
  ```
- 422 Unprocessable Entity: Erro de validação
  ```json
  {
    "errors": {
      "email": ["já está em uso"],
      "password": ["deve conter pelo menos uma letra maiúscula, uma minúscula e um número"]
    }
  }
  ```

#### POST /login
Autentica um usuário existente.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "Senha123"
}
```

**Respostas:**
- 200 OK: Login bem-sucedido
  ```json
  {
    "user": {
      "id": 1,
      "email": "usuario@exemplo.com",
      "name": "Nome do Usuário",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
  ```
- 401 Unauthorized: Credenciais inválidas
  ```json
  {
    "error": "Email ou senha inválidos"
  }
  ```

#### POST /logout
Desautentica um usuário.

**Headers:**
```
Authorization: Bearer <token>
```

**Respostas:**
- 200 OK: Logout bem-sucedido
  ```json
  {
    "message": "Usuário desautenticado com sucesso"
  }
  ```
- 401 Unauthorized: Token inválido ou expirado
  ```json
  {
    "error": "Não autorizado"
  }
  ```

### Rotas Protegidas

#### GET /me
Retorna os dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Respostas:**
- 200 OK: Dados do usuário
  ```json
  {
    "id": 1,
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
  ```
- 401 Unauthorized: Token inválido ou expirado
  ```json
  {
    "error": "Não autorizado"
  }
  ```

## Validações

### Usuário
- Email:
  - Obrigatório
  - Formato válido
  - Único
  - Convertido para minúsculas automaticamente
- Senha:
  - Obrigatória
  - Mínimo de 8 caracteres
  - Deve conter pelo menos uma letra maiúscula, uma minúscula e um número
- Nome:
  - Opcional
  - Máximo de 100 caracteres

## Segurança
- Tokens JWT expiram em 24 horas
- Senhas são armazenadas com hash bcrypt
- CORS configurado apenas para o domínio do frontend
- Rate limiting implementado para prevenir ataques de força bruta
