# Commandes Docker — Projet Homiqio

> **Deux projets à lancer séparément :**
> - `api-homiqio/` → Laravel + MySQL + Redis (backend)
> - `Maka/` → Next.js (frontend)

---

## 1. Lancer l'API (backend Laravel)

```bash
cd /Users/homiqio/api-homiqio

docker compose up --build -d
```

**Ce que ça démarre :**
| Service | URL |
|---|---|
| API Laravel | http://localhost:8000/api |
| phpMyAdmin (base de données) | http://localhost:8081 |
| MySQL | port 3307 |
| Redis | port 6379 |

**Voir les logs de l'API :**
```bash
docker compose logs -f app
```

**Arrêter l'API :**
```bash
docker compose down
```

---

## 2. Lancer le Frontend (Next.js)

```bash
cd /Users/homiqio/Maka

npm run dev
```

**Accès** → http://localhost:3000

> En mode dev, le frontend pointe automatiquement vers `http://localhost:8000/api`
> (configuré dans `.env.local`)

---

## Ordre de démarrage recommandé

```
1. Lancer l'API d'abord  →  cd /Users/homiqio/api-homiqio && docker compose up --build -d
2. Attendre que l'API soit prête (quelques secondes)
3. Lancer le frontend     →  cd /Users/homiqio/Maka && npm run dev
```

---

## Arrêter tout

```bash
# Arrêter le frontend : Ctrl+C dans le terminal

# Arrêter l'API + base de données
cd /Users/homiqio/api-homiqio
docker compose down
```

---

## Commandes utiles pour l'API

```bash
cd /Users/homiqio/api-homiqio

# Voir les conteneurs qui tournent
docker ps

# Entrer dans le conteneur Laravel (pour artisan, etc.)
docker compose exec app bash

# Lancer les migrations
docker compose exec app php artisan migrate

# Lancer les seeders
docker compose exec app php artisan db:seed

# Voir les logs en temps réel
docker compose logs -f app

# Reconstruire sans cache (si problème)
docker compose build --no-cache
docker compose up -d
```

---

## Résumé des ports

| Service | Port local |
|---|---|
| Frontend (Next.js) | 3000 |
| API (Laravel) | 8000 |
| phpMyAdmin | 8081 |
| MySQL | 3307 |
| Redis | 6379 |
