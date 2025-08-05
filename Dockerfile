# -----------------------------
# Stage 1: Build
# -----------------------------
FROM node:18 AS builder

WORKDIR /app

# Set build-time environment variable
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY . .

# Install dependencies
RUN npm ci

# Increase Node.js heap memory for large builds
ENV NODE_OPTIONS=--max-old-space-size=4096

# Run the build
RUN npm run build

# -----------------------------
# Stage 2: Serve with NGINX
# -----------------------------
FROM nginx:alpine

# Copy the built app (from 'build' folder)
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: Copy custom nginx config if you have it
# COPY nginx.conf /etc/nginx/nginx.conf
