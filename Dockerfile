# Install dependencies only when needed
FROM node:14.19-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache curl \
  && curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app
# Files required by pnpm install
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14.19-alpine AS builder

RUN apk add --no-cache curl \
  && curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
RUN pnpm prisma generate
RUN pnpm build

# Production image, copy the files
FROM node:14.19-alpine AS runner

WORKDIR /app
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

RUN mkdir -p /app/uploads
RUN chown -R nestjs:nodejs /app/uploads

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nestjs

EXPOSE 4000

ENV PORT 4000

# Runing the app
CMD ["node", "dist/main"]