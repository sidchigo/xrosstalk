# --- Build Stage ---
FROM node:22-slim AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# --- Development Stage ---
FROM node:22-slim AS development

WORKDIR /usr/local/frontend

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

ENV PORT=3000
EXPOSE 3000

# Build the app
CMD [ "npm", "run", "dev" ]

# --- Production Stage ---
FROM nginx:1.27-alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built app to nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# (Optional) Copy custom nginx config if you have one
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]