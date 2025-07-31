FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm ci || npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
