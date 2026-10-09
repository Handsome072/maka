# Commandes — Projet Séjoura

> **Un seul projet à lancer :** `Maka/` contient le site (Next.js) et son API (`app/api`).
> La base de données, les comptes et les images sont chez **Supabase, en ligne**.
> Plus de Docker, de MySQL, de Redis ni de Laravel.

---

## 1. Lancer le site

```bash
cd /Users/homiqio/Maka

npm run dev
```

**Accès** → http://localhost:3000 (le site et son API sous `/api`)

**Arrêter** : Ctrl+C dans le terminal.

La configuration locale est dans `.env.local` (jamais versionné). Modèle : `.env.example`.

> ⚠️ En local, le site utilise **la même base Supabase que la production**.
> Une annonce créée ou un compte supprimé en local l'est aussi sur https://sejoura-location.vercel.app

---

## 2. Voir et modifier les données (remplace phpMyAdmin)

Tableau de bord Supabase du projet `ckwzgjdmrkafehunsubh` :

| Besoin | Où |
|---|---|
| Parcourir les tables | https://supabase.com/dashboard/project/ckwzgjdmrkafehunsubh/editor |
| Exécuter du SQL | https://supabase.com/dashboard/project/ckwzgjdmrkafehunsubh/sql/new |
| Comptes (connexion) | https://supabase.com/dashboard/project/ckwzgjdmrkafehunsubh/auth/users |
| Images (bucket `uploads`) | https://supabase.com/dashboard/project/ckwzgjdmrkafehunsubh/storage/buckets |

Ou en ligne de commande (psql, via `SUPABASE_DB_URL` de `.env.local`) :

```bash
npm run db:sql                                   # console SQL interactive
npm run db:sql -- -c "select count(*) from listings"
```

---

## 3. Modifier la structure de la base (remplace `php artisan migrate`)

1. Créer un fichier `supabase/migrations/AAAAMMJJHHMMSS_description.sql`
2. L'appliquer **une seule fois** :

```bash
npm run db:sql -- -1 -f supabase/migrations/AAAAMMJJHHMMSS_description.sql
```

`-1` exécute tout le fichier dans une transaction : en cas d'erreur, rien n'est appliqué.

---

## 4. Mettre en production

Chaque push sur `main` est déployé automatiquement par Vercel.

Les variables d'environnement de production se règlent dans Vercel → projet `maka` → Settings → Environment Variables.
Après une modification, **redéployer** (Deployments → ⋯ → Redeploy) : les variables `NEXT_PUBLIC_*` sont figées au moment du build.

---

## Résumé

| Service | Où |
|---|---|
| Site + API (local) | http://localhost:3000 |
| Base de données, comptes, images | Supabase (en ligne) |
| Production | https://sejoura-location.vercel.app |
