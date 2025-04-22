# 🧪 Teste Técnico – Fullstack Developer (Next.js 15 + Ruby on Rails 7.2)

Muito obrigado por participar do nosso teste técnico!
Sua dedicação e esforço são extremamente valorizados. Sabemos que esse tipo de desafio exige tempo, foco e atenção aos detalhes – e ficamos felizes por você ter topado encarar essa jornada com a gente.

Independentemente do resultado, o simples fato de ter participado já demonstra seu comprometimento e vontade de evoluir como desenvolvedor(a). Continue se desafiando, aprendendo e construindo. Grandes oportunidades surgem para quem segue firme no caminho da evolução. E não se preocupe, independente do resultado, você receberá um a devolutiva! 🚀

Boa sorte e nos vemos em breve! 🙌

## 🎯 Objetivo

Criar uma aplicação fullstack simples com autenticação JWT utilizando Devise no backend Rails e login manual no frontend Next.js 15, com foco em TDD em ambas as partes.

## 🔧 Tecnologias obrigatórias

### Backend: Ruby on Rails 7.2

- Devise
- JWT (com devise-jwt)
- RSpec para TDD

### Frontend: Next.js 15 (App Router)

- API routes
- Autenticação manual (sem next-auth)
- Jest + Testing Library para TDD

## 📌 Descrição das features

- Criação de Conta (Sign up)
- Um formulário no frontend para criação de conta.
- O backend deve registrar o usuário e retornar um token JWT.
- Login
- Um formulário de login que envia e-mail e senha para o backend.
- O backend valida e retorna o JWT.
- O frontend salva o JWT (em cookie HttpOnly ou localStorage) e redireciona para a página do usuário.
- Página protegida de Perfil
- Após login, o usuário é redirecionado para uma página de perfil.
- Essa página faz uma chamada autenticada para o backend usando o JWT para obter os dados do usuário logado.

## ✅ Requisitos obrigatórios

### Backend (Rails 7.2)
- Usar Devise com JWT (devise-jwt)
- Implementar TDD com RSpec
- Endpoints necessários:
- POST /signup
- POST /login
- GET /me (requer autenticação via JWT)

## Frontend (Next.js 15)
Criar as páginas:
- /signup – formulário de criação de conta
- /login – formulário de login
- /profile – protegida, mostra os dados do usuário

Usar API routes do Next.js para intermediar requisições, se necessário

- Implementar testes com Jest e Testing Library
- Proteger a rota /profile de acesso não autorizado

## 🧪 TDD e Testes

- Rails (RSpec)
- Testar criação de usuário
- Testar login e geração de JWT
- Testar rota /me com e sem token
- Next.js (Jest + React Testing Library)
- Testar comportamento dos formulários (signup, login)
- Testar redirecionamento após login
- Testar acesso protegido à página /profile

## 🚀 Critérios de avaliação

- Versionamento no Git
- Implementação correta das features
- Uso adequado de TDD
- Código limpo e organizado
- Proteção e fluxo de autenticação JWT
- Experiência do usuário (UX)

## ⭐ Diferenciais

- Implementação de CI/CD (GitHub Actions / Gitlab CI)
- Docker compose para rodar Frontend + Backend
- Dockerfile para build das imagens (pense em upload para o AWS ECR)

## 📤 Entrega

Suba o projeto no GitHub ou GitLab com instruções claras de como rodar o backend e o frontend, incluindo:

### README.md com instruções para rodar:

- Rails (bundle, rails db:setup, etc.)
- Next.js (npm install, npm run dev)
- Variáveis de ambiente necessárias
- Scripts de testes para backend e frontend (rspec, npm test)

## 📬 Como enviar seu teste técnico

Quando finalizar o teste, envie um e-mail para **vinicius.roveran@eightware.com** com as informações abaixo:

### 1️⃣ Assunto do e-mail  
`Teste Técnico - [Seu Nome]`

### 2️⃣ Corpo do e-mail  
Pode ser algo simples, por exemplo:

> Fala, Vinicius! 👋  
>  
> Seguem os repositórios do teste técnico:  
> - 💻 Frontend (Next.js): [link do repositório]  
> - 🛠️ Backend (Rails): [link do repositório]  
>  
> Qualquer coisa, estou à disposição.  
>  
> Valeu! 🚀

### 3️⃣ Importante ⚠️

- Envie os links de **dois repositórios separados**, um para o frontend e outro para o backend.  
- Se os repositórios forem privados, lembre de liberar o acesso para **vinicius.roveran@eightware.com** 🔒
