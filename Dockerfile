# Etapa 1: Construcción del proyecto
FROM node:20 AS build
WORKDIR /app
COPY . .

# Instala pnpm globalmente
RUN npm install -g pnpm

# Previene preguntas interactivas
ENV CI=true

# Instala dependencias usando pnpm
RUN pnpm install --no-frozen-lockfile

# Genera el build de producción
RUN pnpm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
