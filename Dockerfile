# Dockerfile for Jiyo-Long-Life
# Multi-stage build for Node.js (suitable for Next.js / TypeScript apps)

FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --production --silent

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci --silent
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# If your app uses a custom port, set PORT accordingly
ENV PORT=3000

# copy only what we need to run
COPY --from=builder /app/.next ./.next || true
COPY --from=builder /app/public ./public || true
COPY --from=builder /app/next.config.js ./next.config.js || true
COPY --from=builder /app/package*.json ./
COPY --from=deps /usr/local/lib/node_modules ./node_modules || true

EXPOSE ${PORT}

# Default start command; ensure your package.json has a `start` script that runs the production server
CMD ["npm", "run", "start"]
