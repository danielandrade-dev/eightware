# Configuração Docker para o Projeto

Este projeto utiliza Docker para facilitar o desenvolvimento e a implantação dos ambientes de backend e frontend. Abaixo estão as instruções para executar o projeto usando Docker.

## Pré-requisitos

- Docker instalado (https://docs.docker.com/get-docker/)
- Docker Compose instalado (https://docs.docker.com/compose/install/)

## Estrutura dos Containers

O projeto contém dois serviços principais:

1. **Backend**: Aplicação Ruby on Rails na porta 3000 (HTTP) e 3443 (HTTPS)
2. **Frontend**: Aplicação Next.js na porta 3001 (HTTP) e 3444 (HTTPS)

## Configuração HTTPS

O projeto está configurado para executar com HTTPS usando certificados auto-assinados. Ao iniciar os containers pela primeira vez, os certificados serão gerados automaticamente. Como são certificados auto-assinados, seu navegador irá exibir um aviso de segurança - você pode ignorá-lo de forma segura em ambiente de desenvolvimento.

## Executando o Projeto

### Método simplificado (recomendado)

```bash
# Na raiz do projeto, execute o script:
./bin/docker-start
```

O script gera automaticamente uma chave secreta para o Rails, certificados SSL e executa os containers.

### Método manual

```bash
# Gerar certificados SSL (se ainda não existirem)
mkdir -p ./ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ./ssl/server.key -out ./ssl/server.crt \
  -subj "/C=BR/ST=Estado/L=Cidade/O=Eightware/OU=TI/CN=localhost"
chmod 644 ./ssl/server.crt
chmod 600 ./ssl/server.key

# Gerar uma chave secreta para o Rails
export SECRET_KEY_BASE=$(openssl rand -hex 64)

# Na raiz do projeto, execute:
docker-compose up --build
```

Isso irá construir as imagens e iniciar os containers. O processo de build pode levar alguns minutos na primeira execução.

### Próximas execuções

```bash
docker-compose up
```

### Executar em segundo plano

```bash
docker-compose up -d
```

## Acessando as Aplicações

- **Backend HTTP**: http://localhost:3000
- **Backend HTTPS**: https://localhost:3443
- **Frontend HTTP**: http://localhost:3001
- **Frontend HTTPS**: https://localhost:3444

## Comandos úteis

### Ver os logs dos containers

```bash
# Todos os serviços
docker-compose logs -f

# Apenas um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Executar comandos no container

```bash
# Backend (Rails)
docker-compose exec backend bash
docker-compose exec backend ./bin/rails c
docker-compose exec backend ./bin/rails db:migrate

# Frontend (Next.js)
docker-compose exec frontend sh
docker-compose exec frontend npm run lint
```

### Parar os containers

```bash
docker-compose down
```

### Reconstruir as imagens

```bash
docker-compose build
```

## Variáveis de Ambiente

Para executar em produção, certifique-se de configurar as seguintes variáveis de ambiente:

### Backend

- `RAILS_ENV`: Ambiente Rails (development, test, production)
- `SECRET_KEY_BASE`: Chave secreta usada pelo Rails para criptografar cookies e sessões
- `RAILS_MASTER_KEY`: Chave mestra do Rails para descriptografar as credenciais
- `DATABASE_URL`: URL de conexão com o banco de dados (se diferente do SQLite padrão)
- `RAILS_FORCE_SSL`: Força uso de HTTPS (true/false)

### Frontend

- `NEXT_PUBLIC_API_URL`: URL da API do backend (usando HTTPS)
- `NODE_ENV`: Ambiente do Node.js (development, production)
- `HTTPS`: Define se o servidor deve usar HTTPS (true/false)
- `SSL_CRT_FILE`: Caminho para o certificado SSL
- `SSL_KEY_FILE`: Caminho para a chave privada SSL

## Volumes

Os seguintes volumes são configurados:

- `backend/storage`: Para armazenar uploads e arquivos permanentes
- `backend/db`: Para manter o banco de dados SQLite
- `ssl`: Para armazenar os certificados SSL compartilhados entre os serviços

## Resolução de Problemas

### Erro com libYAML no Backend

Se você encontrar erro relacionado à biblioteca libyaml durante o build do backend, verificar se o Dockerfile inclui a instalação do pacote `libyaml-dev`.

### Erros de Linting no Frontend

O build do frontend está configurado para ignorar os erros de linting usando a flag `--no-lint` no comando de build do Next.js. Em ambientes de produção, considere corrigir os erros de linting em vez de ignorá-los.

### Erro "Missing `secret_key_base`"

Se você encontrar o erro `Missing secret_key_base for 'production' environment`, certifique-se de que a variável de ambiente `SECRET_KEY_BASE` está definida antes de iniciar os containers. O script `bin/docker-start` faz isso automaticamente.

### Erro "ActiveModel::Serializer"

Se você encontrar erro relacionado a `ActiveModel::Serializer` não encontrado, certifique-se de que a gem `active_model_serializers` está definida no Gemfile do backend. Use o script `./bin/docker-start` para reconstruir os containers com as dependências atualizadas.

### Avisos de Segurança no Navegador

Como estamos usando certificados SSL auto-assinados, é normal que seu navegador exiba avisos de segurança. Você pode adicionar uma exceção para esses certificados ou ignorar os avisos durante o desenvolvimento.

## Rede

Os containers estão configurados para se comunicarem através de uma rede bridge chamada `app-network`, o que permite que o frontend acesse o backend usando o nome do serviço como hostname.

## Notas de Produção

Para ambientes de produção, recomenda-se:

1. Utilizar um banco de dados externo como PostgreSQL em vez de SQLite
2. Configurar um servidor web como Nginx para servir os ativos estáticos
3. Ajustar as configurações de segurança adequadamente
4. Utilizar serviços de armazenamento como S3 para uploads
5. Configurar chaves secretas de forma segura (não armazenar no código)
6. Usar certificados SSL válidos em vez de auto-assinados 