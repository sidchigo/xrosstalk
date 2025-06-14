# ---- Build Stage ----
FROM node:22-slim AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# ---- Development Stage ----
FROM node:22-slim AS development

WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .

# For Compose Watch, source files will be synced to /usr/local/app/src
ENV PORT=5000
EXPOSE 5000

CMD ["npm", "run", "dev"]

# ---- Production Stage ----
FROM node:22-slim AS production

WORKDIR /app

# Only copy built files and production dependencies
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]