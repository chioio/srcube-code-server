# Install dependencies only when needed
FROM node:14-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache curl \
  && curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app

# Files required by pnpm install
COPY package.json pnpm-lock.json ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder

RUN apk add --no-cache curl \
  && curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build