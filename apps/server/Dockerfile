FROM oven/bun:latest as base
WORKDIR /usr/src/app

# Install dependencies
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY packages/shared/package.json ./packages/shared/

# Bun workspaces install
RUN bun install

# Copy source
COPY apps/server ./apps/server
COPY packages/shared ./packages/shared

# Final stage
FROM base as release
WORKDIR /usr/src/app/apps/server

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["sh", "-c", "bun run src/db/migrate.ts && bun run src/index.ts"]
