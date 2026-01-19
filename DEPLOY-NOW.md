# 🚀 DÉPLOIEMENT IMMÉDIAT - HOMIQIO

## ✅ Fichiers prêts pour le déploiement

Votre projet Next.js a été construit avec succès et est prêt à être déployé !

### 📦 Archive de déploiement
- **Fichier**: `homiqio-deploy.zip` (4.9 MB)
- **Contenu**: Tous les fichiers statiques Next.js + fichier .htaccess
- **Emplacement**: À la racine du projet

---

## 🎯 ÉTAPES DE DÉPLOIEMENT (5 minutes)

### 1️⃣ Connectez-vous à cPanel
```
URL: https://wasabi.o2switch.net:2083
Utilisateur: homiqio
```

### 2️⃣ Ouvrez le File Manager
- Dans cPanel, cliquez sur **"File Manager"**
- Naviguez vers le dossier **`homiqio.com`**

### 3️⃣ Sauvegardez l'ancien site (IMPORTANT)
- Sélectionnez tous les fichiers dans `homiqio.com`
- Clic droit → **"Compress"**
- Nom: `backup_20260119.zip`
- Créez un dossier `backups` et déplacez-y le backup

### 4️⃣ Nettoyez le dossier
- Sélectionnez tous les fichiers dans `homiqio.com`
- Clic droit → **"Delete"**
- Confirmez la suppression

### 5️⃣ Uploadez la nouvelle version
- Cliquez sur **"Upload"** (bouton en haut)
- Sélectionnez `homiqio-deploy.zip` depuis votre ordinateur
- Attendez la fin de l'upload (barre de progression)

### 6️⃣ Décompressez l'archive
- Retournez au File Manager
- Clic droit sur `homiqio-deploy.zip`
- Sélectionnez **"Extract"**
- Vérifiez que les fichiers sont bien extraits
- Supprimez `homiqio-deploy.zip`

### 7️⃣ Vérifiez le fichier .htaccess
- Dans les paramètres du File Manager, activez **"Show Hidden Files"**
- Vérifiez que `.htaccess` est présent à la racine de `homiqio.com`
- Si absent, uploadez manuellement `public/.htaccess`

### 8️⃣ Testez votre site
Ouvrez dans votre navigateur:
- ✅ https://homiqio.com (page d'accueil)
- ✅ https://homiqio.com/services (page services)
- ✅ https://homiqio.com/experiences (page expériences)
- ✅ https://homiqio.com/search (page recherche)

---

## 🔍 Vérifications Post-Déploiement

### ✅ Checklist
- [ ] Le site s'affiche correctement sur https://homiqio.com
- [ ] La navigation entre les pages fonctionne
- [ ] Les images se chargent (logo, footer, etc.)
- [ ] Le HTTPS est actif (cadenas vert)
- [ ] Les routes dynamiques fonctionnent (/property/1, /service/1, etc.)
- [ ] La page 404 s'affiche pour les routes inexistantes
- [ ] Le design est responsive (mobile/desktop)

### 🐛 En cas de problème

**Les routes ne fonctionnent pas (404)**
→ Vérifiez que `.htaccess` est présent et a les bonnes permissions (644)

**Les images ne se chargent pas**
→ Vérifiez les permissions: `chmod -R 755 ~/homiqio.com`

**Page blanche**
→ Vérifiez les logs d'erreur dans cPanel → "Error Log"

**HTTPS ne fonctionne pas**
→ Vérifiez le certificat SSL dans cPanel → "SSL/TLS Status"

---

## 🔄 Pour les prochains déploiements

### Méthode rapide
```bash
# 1. Reconstruire le projet
npm run deploy:prepare

# 2. Créer l'archive
cd out && zip -r ../homiqio-deploy.zip . && cd ..

# 3. Uploader via cPanel File Manager
```

### Méthode automatique (si SSH configuré)
```bash
./deploy.sh
```

---

## 📞 Support

**o2switch**
- Panel: https://wasabi.o2switch.net:2083
- Support: support@o2switch.fr

**Documentation**
- Guide complet: `DEPLOYMENT.md`
- Configuration Next.js: `next.config.ts`
- Configuration Apache: `public/.htaccess`

---

## 🎉 C'est tout !

Votre site HOMIQIO est maintenant déployé et accessible sur https://homiqio.com

Bon déploiement ! 🚀

