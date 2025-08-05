# Stage 1: Build the app
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build arg
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
# Install build dependencies
RUN apk add --no-cache python3 make g++
RUN npm ci || npm install

COPY . .

# Increase memory for build (avoids OOM on large React builds)
RUN NODE_OPTIONS="--max_old_space_size=4096" npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
