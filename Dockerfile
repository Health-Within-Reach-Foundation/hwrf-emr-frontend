# Dockerfile

# Stage 1: Build the React app
FROM node:18 AS builder

WORKDIR /app

# Set build args and environment
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY . .

RUN npm ci
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

# Optional: custom nginx config (uncomment if needed)
# COPY nginx.conf /etc/nginx/nginx.conf
