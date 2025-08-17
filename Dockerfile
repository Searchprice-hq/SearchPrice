# 1) Build stage
FROM node:24-alpine AS builder
WORKDIR /app

# Melhora compat com libs nativas (opcional)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# --- VARIÁVEIS DE BUILD ---
ARG API_URL
ENV API_URL=${API_URL}

ARG API_KEY 
ENV API_KEY=${API_KEY}

RUN npm run build

# 2) Runtime stage
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia artefatos mínimos
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# --- VARIÁVEIS DE RUNTIME ---
ENV API_URL=
ENV API_KEY=

EXPOSE 3000
CMD ["npm", "start"]