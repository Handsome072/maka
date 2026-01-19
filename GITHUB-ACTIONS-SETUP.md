# 🚀 Configuration du Déploiement Automatique GitHub Actions

## 📋 Vue d'ensemble

Ce projet utilise GitHub Actions pour déployer automatiquement vers o2switch à chaque push sur la branche `main`.

## 🔐 Configuration des Secrets GitHub

Pour que le déploiement fonctionne, vous devez configurer les secrets FTP dans votre repository GitHub.

### Étape 1: Accéder aux Secrets GitHub

1. Allez sur votre repository GitHub: https://github.com/Handsome072/maka
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**
4. Cliquez sur **New repository secret**

### Étape 2: Ajouter les Secrets FTP

Créez les 3 secrets suivants :

#### Secret 1: `FTP_SERVER`
- **Name:** `FTP_SERVER`
- **Value:** `ftp.homiqio.com` ou `wasabi.o2switch.net`

#### Secret 2: `FTP_USERNAME`
- **Name:** `FTP_USERNAME`
- **Value:** Votre nom d'utilisateur FTP o2switch (probablement `homiqio@homiqio.com` ou `homiqio`)

#### Secret 3: `FTP_PASSWORD`
- **Name:** `FTP_PASSWORD`
- **Value:** Votre mot de passe FTP o2switch

### 📍 Comment trouver vos identifiants FTP o2switch

1. Connectez-vous à votre cPanel o2switch: https://wasabi.o2switch.net:2083/
2. Cherchez la section **FTP Accounts** ou **Comptes FTP**
3. Vos identifiants FTP sont :
   - **Serveur:** `ftp.homiqio.com` ou `wasabi.o2switch.net`
   - **Utilisateur:** Généralement `homiqio@homiqio.com` ou le nom de votre compte
   - **Mot de passe:** Le mot de passe de votre compte cPanel (ou créez un compte FTP dédié)
   - **Port:** 21 (FTP standard)

### Alternative: Créer un compte FTP dédié (Recommandé)

Pour plus de sécurité, créez un compte FTP spécifique pour GitHub Actions :

1. Dans cPanel, allez dans **FTP Accounts**
2. Créez un nouveau compte FTP :
   - **Login:** `github-deploy@homiqio.com`
   - **Password:** Générez un mot de passe fort
   - **Directory:** `/homiqio.com`
   - **Quota:** Unlimited ou selon vos besoins
3. Utilisez ces identifiants dans les secrets GitHub

## 🔄 Workflow de Déploiement

### Déclenchement Automatique

Le déploiement se déclenche automatiquement à chaque fois que vous :
```bash
git add .
git commit -m "votre message"
git push origin main
```

### Déclenchement Manuel

Vous pouvez aussi déclencher le déploiement manuellement :
1. Allez sur GitHub → **Actions**
2. Sélectionnez le workflow **Deploy to o2switch**
3. Cliquez sur **Run workflow**

## 📊 Processus de Déploiement

Voici ce qui se passe automatiquement :

1. ✅ **Checkout du code** - GitHub récupère votre code
2. ✅ **Installation de Node.js 18** - Configuration de l'environnement
3. ✅ **Installation des dépendances** - `npm ci`
4. ✅ **Build du projet** - `npm run deploy:prepare`
   - Génère les fichiers statiques dans `out/`
   - Copie le fichier `.htaccess`
5. ✅ **Déploiement FTP** - Upload vers `homiqio.com/`
6. ✅ **Vérification** - Confirmation du déploiement

## 🕐 Temps de Déploiement

- **Build:** ~2-3 minutes
- **Upload FTP:** ~1-2 minutes
- **Total:** ~3-5 minutes

## 📝 Vérifier le Déploiement

### Sur GitHub
1. Allez dans l'onglet **Actions** de votre repository
2. Vous verrez l'historique de tous les déploiements
3. Cliquez sur un déploiement pour voir les logs détaillés

### Sur votre site
1. Ouvrez https://homiqio.com/
2. Videz le cache (Ctrl+Shift+R)
3. Vérifiez que vos modifications sont visibles

## 🔧 Dépannage

### Le déploiement échoue avec "FTP connection failed"
- Vérifiez que les secrets FTP sont correctement configurés
- Vérifiez que le serveur FTP est `ftp.homiqio.com` ou `wasabi.o2switch.net`
- Vérifiez que le mot de passe est correct

### Le build échoue
- Vérifiez les logs dans l'onglet Actions
- Assurez-vous que `npm run deploy:prepare` fonctionne localement

### Les fichiers ne sont pas mis à jour sur le site
- Videz le cache de votre navigateur
- Vérifiez dans cPanel File Manager que les fichiers ont bien été uploadés
- Vérifiez que le `server-dir` est correct (`/homiqio.com/`)

## 🎯 Avantages de cette Solution

✅ **Automatique** - Plus besoin de créer des ZIP manuellement
✅ **Rapide** - Déploiement en 3-5 minutes
✅ **Traçable** - Historique complet dans GitHub Actions
✅ **Sécurisé** - Secrets chiffrés dans GitHub
✅ **Fiable** - Même processus à chaque déploiement
✅ **Gratuit** - GitHub Actions est gratuit pour les repos publics

## 📚 Commandes Utiles

### Déploiement complet (local + GitHub)
```bash
# 1. Modifier le code
# 2. Tester localement
npm run dev

# 3. Committer et pousser
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 4. Le déploiement se fait automatiquement !
```

### Vérifier le build localement avant de pousser
```bash
npm run deploy:prepare
ls -la out/
```

## 🔗 Liens Utiles

- **Repository GitHub:** https://github.com/Handsome072/maka
- **GitHub Actions:** https://github.com/Handsome072/maka/actions
- **Site en production:** https://homiqio.com/
- **cPanel o2switch:** https://wasabi.o2switch.net:2083/

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans GitHub Actions
2. Vérifiez les secrets FTP
3. Testez la connexion FTP avec un client FTP (FileZilla)
4. Contactez le support o2switch si nécessaire

