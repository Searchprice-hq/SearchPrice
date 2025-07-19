# 1) Build Stage
FROM node:24-alpine AS builder
WORKDIR /app

# Instala dependências
COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci

# Copia todo o código _incluindo_ .env.production (ou .env.local)
COPY . .

# Gera o build (Next carrega automaticamente .env.production / .env.local)
RUN npm run build

# 2) Runtime Stage
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia apenas o necessário para rodar em produção
COPY --from=builder /app/package.json    ./
COPY --from=builder /app/node_modules     ./node_modules
COPY --from=builder /app/.next            ./.next
COPY --from=builder /app/public           ./public

EXPOSE 3000

CMD ["npm", "start"]
