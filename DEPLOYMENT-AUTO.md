# 🚀 Déploiement Automatisé - Guide Complet

## 📋 Vue d'ensemble

Ce projet utilise **GitHub Actions** pour déployer automatiquement votre site Next.js vers o2switch à chaque modification du code.

**Plus besoin de :**
- ❌ Créer des fichiers ZIP manuellement
- ❌ Se connecter à cPanel
- ❌ Uploader et extraire des fichiers
- ❌ Gérer les déploiements manuellement

**Maintenant :**
- ✅ Modifiez votre code
- ✅ Faites un `git push`
- ✅ Le site se met à jour automatiquement en 3-5 minutes !

---

## 🔧 Configuration Initiale (À faire une seule fois)

### Étape 1: Configurer les Secrets GitHub

1. **Allez sur votre repository GitHub:**
   - URL: https://github.com/Handsome072/maka

2. **Accédez aux Settings:**
   - Cliquez sur **Settings** (en haut à droite)
   - Dans le menu de gauche: **Secrets and variables** → **Actions**

3. **Ajoutez 3 secrets:**

   **Secret 1: FTP_SERVER**
   - Cliquez sur **New repository secret**
   - Name: `FTP_SERVER`
   - Value: `ftp.homiqio.com` (ou `wasabi.o2switch.net`)
   - Cliquez sur **Add secret**

   **Secret 2: FTP_USERNAME**
   - Cliquez sur **New repository secret**
   - Name: `FTP_USERNAME`
   - Value: Votre nom d'utilisateur FTP (ex: `homiqio@homiqio.com`)
   - Cliquez sur **Add secret**

   **Secret 3: FTP_PASSWORD**
   - Cliquez sur **New repository secret**
   - Name: `FTP_PASSWORD`
   - Value: Votre mot de passe FTP o2switch
   - Cliquez sur **Add secret**

### Étape 2: Trouver vos Identifiants FTP

**Option A: Via cPanel**
1. Connectez-vous à cPanel: https://wasabi.o2switch.net:2083/
2. Cherchez **"FTP Accounts"** ou **"Comptes FTP"**
3. Notez vos identifiants existants ou créez un nouveau compte FTP

**Option B: Créer un compte FTP dédié (Recommandé)**
1. Dans cPanel → **FTP Accounts**
2. Créez un nouveau compte:
   - **Login:** `github-deploy@homiqio.com`
   - **Password:** Générez un mot de passe fort
   - **Directory:** `/homiqio.com`
   - **Quota:** Unlimited
3. Utilisez ces identifiants dans les secrets GitHub

### Étape 3: Pousser le Workflow sur GitHub

```bash
# Ajouter les nouveaux fichiers
git add .github/workflows/deploy.yml
git add GITHUB-ACTIONS-SETUP.md
git add DEPLOYMENT-AUTO.md
git add deploy-ftp-auto.sh
git add .gitignore

# Committer
git commit -m "feat: Ajouter déploiement automatique via GitHub Actions"

# Pousser vers GitHub
git push origin main
```

**🎉 C'est tout ! Le déploiement automatique est maintenant configuré !**

---

## 🔄 Workflow de Développement Quotidien

### Scénario 1: Modification Simple

```bash
# 1. Modifier votre code
# Exemple: Changer du texte dans src/app/pages/Home.tsx

# 2. Tester localement (optionnel)
npm run dev

# 3. Committer et pousser
git add .
git commit -m "fix: Corriger le titre de la section"
git push origin main

# 4. Attendre 3-5 minutes
# → Le site se met à jour automatiquement !
```

### Scénario 2: Nouvelle Fonctionnalité

```bash
# 1. Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# 2. Développer et tester
npm run dev

# 3. Committer
git add .
git commit -m "feat: Ajouter nouvelle fonctionnalité"

# 4. Pousser la branche
git push origin feature/nouvelle-fonctionnalite

# 5. Créer une Pull Request sur GitHub
# 6. Merger dans main
# → Le déploiement se déclenche automatiquement !
```

### Scénario 3: Déploiement Manuel

Si vous voulez déclencher un déploiement sans modifier le code :

1. Allez sur GitHub → **Actions**
2. Sélectionnez **Deploy to o2switch**
3. Cliquez sur **Run workflow**
4. Sélectionnez la branche `main`
5. Cliquez sur **Run workflow**

---

## 📊 Suivre le Déploiement

### Sur GitHub Actions

1. **Allez dans l'onglet Actions:**
   - URL: https://github.com/Handsome072/maka/actions

2. **Vous verrez:**
   - ✅ Déploiements réussis (vert)
   - ❌ Déploiements échoués (rouge)
   - 🟡 Déploiements en cours (jaune)

3. **Cliquez sur un déploiement pour voir:**
   - Les logs détaillés
   - Le temps d'exécution
   - Les erreurs éventuelles

### Étapes du Déploiement

Chaque déploiement passe par ces étapes :

1. **📥 Checkout code** (~10s)
   - GitHub récupère votre code

2. **🔧 Setup Node.js** (~20s)
   - Installation de Node.js 18

3. **📦 Install dependencies** (~1-2min)
   - `npm ci` installe les dépendances

4. **🏗️ Build Next.js project** (~1-2min)
   - `npm run deploy:prepare` génère les fichiers statiques

5. **📋 Verify build output** (~5s)
   - Vérification du build

6. **🚀 Deploy to o2switch via FTP** (~1-2min)
   - Upload des fichiers vers o2switch

7. **✅ Deployment complete** (~5s)
   - Confirmation

**Temps total: 3-5 minutes**

---

## 🔍 Vérifier le Déploiement

### 1. Vérifier sur GitHub Actions
- Allez dans **Actions** → Vérifiez que le workflow est ✅ vert

### 2. Vérifier sur le site
```bash
# Ouvrez votre site
open https://homiqio.com/

# Videz le cache du navigateur
# macOS: Cmd + Shift + R
# Windows/Linux: Ctrl + Shift + R
```

### 3. Vérifier dans cPanel (optionnel)
1. Connectez-vous à cPanel
2. Allez dans **File Manager**
3. Naviguez vers `homiqio.com/`
4. Vérifiez que les fichiers ont été mis à jour (regardez la date de modification)

---

## 🛠️ Déploiement Local (Alternative)

Si vous voulez tester le déploiement FTP localement avant de pousser sur GitHub :

```bash
# 1. Installer lftp (si pas déjà installé)
brew install lftp  # macOS
# ou
sudo apt-get install lftp  # Ubuntu/Debian

# 2. Configurer les variables d'environnement
export FTP_SERVER='ftp.homiqio.com'
export FTP_USER='homiqio@homiqio.com'
export FTP_PASSWORD='votre_mot_de_passe'

# 3. Lancer le déploiement
./deploy-ftp-auto.sh
```

---

## 🐛 Dépannage

### Problème 1: Le déploiement échoue avec "FTP connection failed"

**Solution:**
1. Vérifiez les secrets GitHub (Settings → Secrets → Actions)
2. Vérifiez que `FTP_SERVER` est `ftp.homiqio.com` ou `wasabi.o2switch.net`
3. Vérifiez que le mot de passe FTP est correct
4. Testez la connexion FTP avec FileZilla

### Problème 2: Le build échoue

**Solution:**
1. Vérifiez les logs dans GitHub Actions
2. Testez le build localement: `npm run deploy:prepare`
3. Vérifiez qu'il n'y a pas d'erreurs TypeScript

### Problème 3: Les fichiers ne sont pas mis à jour sur le site

**Solution:**
1. Videz le cache du navigateur (Ctrl+Shift+R)
2. Vérifiez dans cPanel File Manager que les fichiers ont été uploadés
3. Vérifiez que le `server-dir` dans le workflow est `/homiqio.com/`

### Problème 4: Le déploiement est lent

**Causes possibles:**
- Connexion FTP lente
- Beaucoup de fichiers à uploader
- Serveur o2switch surchargé

**Solution:**
- Le déploiement FTP peut prendre 2-3 minutes, c'est normal
- GitHub Actions optimise déjà l'upload avec `parallel=3`

---

## 📚 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `.github/workflows/deploy.yml` | Configuration GitHub Actions |
| `GITHUB-ACTIONS-SETUP.md` | Guide de configuration détaillé |
| `DEPLOYMENT-AUTO.md` | Ce fichier - Guide d'utilisation |
| `deploy-ftp-auto.sh` | Script de déploiement FTP local |
| `package.json` | Scripts npm (deploy:prepare) |
| `next.config.ts` | Configuration Next.js (export statique) |
| `public/.htaccess` | Configuration Apache pour o2switch |

---

## 🎯 Avantages

✅ **Automatique** - Déploiement à chaque push
✅ **Rapide** - 3-5 minutes par déploiement
✅ **Fiable** - Même processus à chaque fois
✅ **Traçable** - Historique complet dans GitHub Actions
✅ **Sécurisé** - Secrets chiffrés dans GitHub
✅ **Gratuit** - GitHub Actions gratuit pour repos publics
✅ **Rollback facile** - Revenez à une version précédente en 1 clic

---

## 🔗 Liens Utiles

- **Repository:** https://github.com/Handsome072/maka
- **GitHub Actions:** https://github.com/Handsome072/maka/actions
- **Site Production:** https://homiqio.com/
- **cPanel o2switch:** https://wasabi.o2switch.net:2083/

---

## 📞 Support

En cas de problème :
1. Consultez les logs dans GitHub Actions
2. Vérifiez ce guide de dépannage
3. Testez la connexion FTP avec FileZilla
4. Contactez le support o2switch si nécessaire

