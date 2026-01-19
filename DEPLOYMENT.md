# Guide de Déploiement HOMIQIO sur o2switch

## ✅ DÉPLOIEMENT RAPIDE (Recommandé)

### Étape 1: Préparer les fichiers

L'archive `homiqio-deploy.zip` (4.9 MB) est déjà prête et contient tous les fichiers nécessaires.

Pour reconstruire si nécessaire:
```bash
npm run deploy:prepare
cd out && zip -r ../homiqio-deploy.zip . && cd ..
```

### Étape 2: Uploader via cPanel File Manager

1. **Connectez-vous à cPanel**
   - URL: https://wasabi.o2switch.net:2083
   - Utilisateur: homiqio
   - Mot de passe: [votre mot de passe]

2. **Ouvrez le File Manager**
   - Cliquez sur "File Manager" dans cPanel
   - Naviguez vers le dossier `homiqio.com`

3. **Backup de l'ancien site (optionnel mais recommandé)**
   - Sélectionnez tous les fichiers dans `homiqio.com`
   - Clic droit > "Compress"
   - Nommez: `backup_YYYYMMDD.zip`
   - Déplacez le backup dans un dossier `backups`

4. **Nettoyez le dossier**
   - Sélectionnez tous les fichiers dans `homiqio.com`
   - Clic droit > "Delete"

5. **Uploadez la nouvelle version**
   - Cliquez sur "Upload" en haut
   - Sélectionnez `homiqio-deploy.zip` depuis votre ordinateur
   - Attendez la fin de l'upload (4.9 MB)

6. **Décompressez l'archive**
   - Retournez au File Manager
   - Clic droit sur `homiqio-deploy.zip`
   - Sélectionnez "Extract"
   - Vérifiez que les fichiers sont extraits dans `homiqio.com`
   - Supprimez `homiqio-deploy.zip` après extraction

7. **Vérifiez le fichier .htaccess**
   - Assurez-vous que `.htaccess` est présent à la racine de `homiqio.com`
   - Si vous ne le voyez pas, activez "Show Hidden Files" dans les paramètres du File Manager

8. **Testez votre site**
   - Ouvrez https://homiqio.com dans votre navigateur
   - Testez la navigation entre les pages
   - Vérifiez que les images se chargent correctement

## Méthodes Alternatives

### Méthode 1: Script de déploiement FTP

```bash
./deploy-ftp.sh
```

Ce script va:
1. Construire le projet Next.js
2. Créer l'archive ZIP
3. Vous guider pour l'upload

### Méthode 2: Déploiement manuel via SSH

```bash
# 1. Construire le projet
npm run deploy:prepare

# 2. Se connecter au serveur
ssh homiqio@wasabi.o2switch.net

# 3. Sur le serveur, créer un backup (optionnel)
mv ~/homiqio.com ~/homiqio.com.backup_$(date +%Y%m%d_%H%M%S)

# 4. Créer le dossier de destination
mkdir -p ~/homiqio.com

# 5. Depuis votre machine locale, transférer les fichiers
scp -r out/* homiqio@wasabi.o2switch.net:~/homiqio.com/

# 6. Sur le serveur, configurer les permissions
chmod -R 755 ~/homiqio.com
find ~/homiqio.com -type f -exec chmod 644 {} \;
```

### Méthode 3: Via Git (si configuré)

```bash
# 1. Construire le projet
npm run deploy:prepare

# 2. Commit et push
git add out/
git commit -m "Build: Deploy to production"
git push origin main

# 3. Sur le serveur o2switch
ssh homiqio@wasabi.o2switch.net
cd ~/homiqio.com
git pull origin main
```

## Configuration SSH

Assurez-vous que votre clé SSH est configurée:

```bash
# Vérifier la connexion SSH
ssh homiqio@wasabi.o2switch.net

# Si nécessaire, ajouter votre clé SSH
ssh-copy-id homiqio@wasabi.o2switch.net
```

## Vérification Post-Déploiement

Après le déploiement, vérifiez:

1. ✅ Le site est accessible sur https://homiqio.com
2. ✅ Les routes fonctionnent correctement (navigation)
3. ✅ Les images et assets se chargent
4. ✅ Le HTTPS est actif
5. ✅ Les redirections fonctionnent

## Fichiers Importants

- `public/.htaccess` - Configuration Apache pour les routes Next.js
- `out/` - Dossier contenant les fichiers statiques générés
- `deploy.sh` - Script de déploiement automatique
- `next.config.ts` - Configuration Next.js pour l'export statique

## Troubleshooting

### Les routes ne fonctionnent pas (404)
- Vérifiez que le fichier `.htaccess` est présent dans `~/homiqio.com/`
- Vérifiez les permissions: `chmod 644 ~/homiqio.com/.htaccess`

### Les images ne se chargent pas
- Vérifiez que `images.unoptimized = true` dans `next.config.ts`
- Vérifiez les permissions des fichiers: `chmod -R 755 ~/homiqio.com`

### Erreur de connexion SSH
- Vérifiez vos identifiants SSH
- Testez la connexion: `ssh homiqio@wasabi.o2switch.net`

## Contact o2switch

- Panel cPanel: https://wasabi.o2switch.net:2083
- Support: support@o2switch.fr

