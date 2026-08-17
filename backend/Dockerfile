# Step 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL and compatibility libraries for Prisma query engine
RUN sed -i 's/https/http/' /etc/apk/repositories && \
    apk update && \
    apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Step 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install OpenSSL and compatibility libraries in runtime environment
RUN sed -i 's/https/http/' /etc/apk/repositories && \
    apk update && \
    apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main"]
