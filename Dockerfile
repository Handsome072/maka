# ============================================================
# Stage 1 : Build (génère les fichiers statiques dans /app/out)
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances en premier (cache optimal)
COPY package*.json ./
RUN npm ci

# Copier le reste du projet
COPY . .

# Utiliser les variables d'environnement de production
ENV NEXT_PUBLIC_API_URL=https://api.homiqio.com/api

# Construire le projet (génère le dossier out/)
RUN npm run build

# ============================================================
# Stage 2 : Servir les fichiers statiques avec Nginx
# ============================================================
FROM nginx:1.27-alpine

# Copier les fichiers buildés vers Nginx
COPY --from=builder /app/out /usr/share/nginx/html

# Configuration Nginx pour Next.js static export
RUN printf 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ $uri.html /index.html;\n\
    }\n\
\n\
    # Cache des assets statiques\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
