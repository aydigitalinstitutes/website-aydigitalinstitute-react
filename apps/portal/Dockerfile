FROM node:20-alpine AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json ./
COPY admin/package*.json ./admin/

# Install dependencies
RUN npm install
RUN npm -C admin install

COPY . .

# Build
RUN npm -C admin run build

FROM nginx:alpine

COPY --from=builder /app/admin/dist /usr/share/nginx/html
COPY nginx/admin.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
