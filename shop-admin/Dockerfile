# ========== Stage 1: Build ==========
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time env vars
ARG VITE_API_BASE_URL=/api
ARG VITE_MINIO_URL=http://localhost:9000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_MINIO_URL=$VITE_MINIO_URL

# Install dependencies first (layer cache optimization)
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \n  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \n  elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm install --frozen-lockfile; \n  else npm ci; \n  fi

# Copy source and build with Vite
COPY . .
RUN npm run build

# ========== Stage 2: Production Server ==========
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Install serve
RUN npm install -g serve@14

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/ || exit 1

CMD ["serve", "-s", "dist", "-l", "3001"]
