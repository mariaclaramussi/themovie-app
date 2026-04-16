# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_TMDB_API_KEY
ARG REACT_APP_TMDB_BASE_URL
ARG REACT_APP_TMDB_IMG_URL
RUN npm run build

# Stage 2: serve
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
