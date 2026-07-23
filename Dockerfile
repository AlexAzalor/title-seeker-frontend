# Alpine - if your project is small and mostly JavaScript-based.
# Regular (node:18) or slim (node:18-slim) - If you hit compatibility issues (bcrypt, sharp, puppeteer).
# FROM node:18-alpine AS base
FROM node:24.18.0-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Enable Corepack (Yarn 4)
RUN corepack enable

# -----------------------------------------------------------------------------
# Dependencies
# -----------------------------------------------------------------------------
FROM base AS deps

COPY package.json yarn.lock .yarnrc.yml ./

# Copy Yarn release/config if it exists
COPY .yarn ./.yarn

RUN yarn install --immutable

# -----------------------------------------------------------------------------
# Builder
# -----------------------------------------------------------------------------
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn gen-api
RUN yarn build

# -----------------------------------------------------------------------------
# Production
# -----------------------------------------------------------------------------
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
