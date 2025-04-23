FROM node:20-slim AS base

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar o pnpm
RUN npm install -g pnpm

# Instalar dependências
RUN pnpm install

# Copiar o restante dos arquivos
COPY . .

# Fase de build
FROM base AS build
# Usando --no-lint para ignorar erros de linting durante o build
RUN pnpm next build --no-lint

# Fase de produção
FROM node:20-slim AS production
WORKDIR /app

# Copiar node_modules e arquivos de build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts

# Expor porta 3000
EXPOSE 3000

# Iniciar o aplicativo
CMD ["npm", "start"] 