# Dockerfile для Next.js приложения

# Стадия 1: Установка зависимостей
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы для установки зависимостей
COPY package.json package-lock.json* ./
RUN npm ci

# Стадия 2: Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем зависимости из предыдущей стадии
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Устанавливаем переменные окружения для сборки (если нужны)
ENV NEXT_TELEMETRY_DISABLED 1

# Собираем приложение
RUN npm run build

# Стадия 3: Production образ
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Создаем непривилегированного пользователя
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Устанавливаем права доступа
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]




