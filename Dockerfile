# Dockerfile

# Base image
FROM node:18 AS builder

WORKDIR /app

# Set build args
ARG VITE_API_URL

# Inject build-time environment variable into Vite
ENV VITE_API_URL=${VITE_API_URL}

COPY . .

RUN npm ci && npm run build

# -----------------------------

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: copy custom nginx.conf
# COPY nginx.conf /etc/nginx/nginx.conf
