# 🔐 Configuration des Secrets GitHub - Guide Pas à Pas

## ⚠️ IMPORTANT: À faire MAINTENANT pour activer le déploiement automatique

Le workflow GitHub Actions a été poussé sur votre repository, mais il ne fonctionnera pas tant que vous n'aurez pas configuré les secrets FTP.

---

## 📍 Étape 1: Trouver vos Identifiants FTP o2switch

### Option A: Utiliser votre compte principal cPanel

1. **Connectez-vous à cPanel:**
   - URL: https://wasabi.o2switch.net:2083/
   - Utilisateur: Votre nom d'utilisateur o2switch
   - Mot de passe: Votre mot de passe cPanel

2. **Vos identifiants FTP sont:**
   - **Serveur FTP:** `ftp.homiqio.com` ou `wasabi.o2switch.net`
   - **Utilisateur FTP:** `homiqio@homiqio.com` (ou votre nom d'utilisateur principal)
   - **Mot de passe FTP:** Le même que votre mot de passe cPanel

### Option B: Créer un compte FTP dédié (RECOMMANDÉ pour la sécurité)

1. **Dans cPanel, cherchez "FTP Accounts":**
   - Cliquez sur **FTP Accounts** ou **Comptes FTP**

2. **Créez un nouveau compte FTP:**
   - **Login:** `github-deploy` (le système ajoutera automatiquement `@homiqio.com`)
   - **Password:** Cliquez sur **Generate Password** pour créer un mot de passe fort
   - **Directory:** `/homiqio.com` (ou laissez vide pour accès complet)
   - **Quota:** Unlimited (ou selon vos besoins)
   - Cliquez sur **Create FTP Account**

3. **Notez vos identifiants:**
   - **Serveur:** `ftp.homiqio.com`
   - **Utilisateur:** `github-deploy@homiqio.com`
   - **Mot de passe:** Le mot de passe que vous avez généré

---

## 🔧 Étape 2: Configurer les Secrets sur GitHub

### 1. Accéder à votre Repository GitHub

Ouvrez votre navigateur et allez sur:
```
https://github.com/Handsome072/maka
```

### 2. Aller dans Settings

- Cliquez sur l'onglet **Settings** (en haut à droite du repository)
- Si vous ne voyez pas Settings, c'est que vous n'avez pas les droits d'administration

### 3. Accéder aux Secrets

- Dans le menu de gauche, cherchez **Secrets and variables**
- Cliquez sur **Secrets and variables**
- Puis cliquez sur **Actions**

### 4. Ajouter le Premier Secret: FTP_SERVER

1. Cliquez sur le bouton vert **New repository secret**
2. Remplissez:
   - **Name:** `FTP_SERVER`
   - **Secret:** `ftp.homiqio.com`
3. Cliquez sur **Add secret**

### 5. Ajouter le Deuxième Secret: FTP_USERNAME

1. Cliquez à nouveau sur **New repository secret**
2. Remplissez:
   - **Name:** `FTP_USERNAME`
   - **Secret:** Votre nom d'utilisateur FTP (ex: `homiqio@homiqio.com` ou `github-deploy@homiqio.com`)
3. Cliquez sur **Add secret**

### 6. Ajouter le Troisième Secret: FTP_PASSWORD

1. Cliquez à nouveau sur **New repository secret**
2. Remplissez:
   - **Name:** `FTP_PASSWORD`
   - **Secret:** Votre mot de passe FTP
3. Cliquez sur **Add secret**

### 7. Vérifier que les 3 Secrets sont Créés

Vous devriez maintenant voir 3 secrets dans la liste:
- ✅ `FTP_SERVER`
- ✅ `FTP_USERNAME`
- ✅ `FTP_PASSWORD`

---

## 🧪 Étape 3: Tester le Déploiement Automatique

### Option A: Déclencher Manuellement le Workflow

1. **Allez dans l'onglet Actions:**
   ```
   https://github.com/Handsome072/maka/actions
   ```

2. **Sélectionnez le workflow "Deploy to o2switch":**
   - Dans la liste de gauche, cliquez sur **Deploy to o2switch**

3. **Lancez le workflow manuellement:**
   - Cliquez sur le bouton **Run workflow** (à droite)
   - Sélectionnez la branche `main`
   - Cliquez sur **Run workflow** (vert)

4. **Suivez le déploiement:**
   - Un nouveau workflow apparaîtra dans la liste
   - Cliquez dessus pour voir les logs en temps réel
   - Le déploiement devrait prendre 3-5 minutes

### Option B: Faire un Push pour Déclencher le Déploiement

Faites une petite modification et poussez-la:

```bash
# Créer un fichier test
echo "Test déploiement automatique" > test-deploy.txt

# Committer
git add test-deploy.txt
git commit -m "test: Tester le déploiement automatique"

# Pousser
git push origin main
```

Puis allez dans **Actions** pour voir le déploiement se lancer automatiquement.

---

## ✅ Étape 4: Vérifier que le Déploiement a Réussi

### 1. Sur GitHub Actions

- Le workflow doit être **vert** (✅)
- Toutes les étapes doivent être complétées
- Vous devriez voir "Deployment complete" à la fin

### 2. Sur votre Site

1. Ouvrez https://homiqio.com/
2. Videz le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)
3. Vérifiez que le site s'affiche correctement

### 3. Dans cPanel (Optionnel)

1. Allez dans **File Manager**
2. Naviguez vers `homiqio.com/`
3. Vérifiez que les fichiers ont été mis à jour (regardez la date de modification)

---

## 🐛 Dépannage

### Erreur: "FTP connection failed"

**Causes possibles:**
- Les secrets ne sont pas configurés correctement
- Le serveur FTP est incorrect
- Le mot de passe est incorrect

**Solutions:**
1. Vérifiez que les 3 secrets existent dans GitHub
2. Vérifiez que `FTP_SERVER` est bien `ftp.homiqio.com`
3. Testez la connexion FTP avec FileZilla:
   - Hôte: `ftp.homiqio.com`
   - Utilisateur: Votre `FTP_USERNAME`
   - Mot de passe: Votre `FTP_PASSWORD`
   - Port: 21

### Erreur: "Permission denied"

**Cause:**
- Le compte FTP n'a pas les droits d'écriture sur `/homiqio.com/`

**Solution:**
1. Dans cPanel → FTP Accounts
2. Vérifiez que le compte FTP a accès au dossier `/homiqio.com/`
3. Ou utilisez votre compte principal cPanel

### Le workflow ne se déclenche pas

**Causes possibles:**
- Le fichier `.github/workflows/deploy.yml` n'est pas sur la branche `main`
- Vous avez poussé sur une autre branche

**Solution:**
1. Vérifiez que vous êtes sur `main`: `git branch`
2. Vérifiez que le fichier existe: `ls .github/workflows/deploy.yml`
3. Poussez sur `main`: `git push origin main`

---

## 🎉 Félicitations !

Une fois les secrets configurés, votre déploiement automatique est opérationnel !

**Désormais, à chaque `git push origin main`:**
1. ✅ GitHub Actions se déclenche automatiquement
2. ✅ Le projet est buildé
3. ✅ Les fichiers sont déployés sur o2switch
4. ✅ Votre site est mis à jour en 3-5 minutes

**Plus besoin de:**
- ❌ Créer des ZIP manuellement
- ❌ Se connecter à cPanel
- ❌ Uploader des fichiers
- ❌ Extraire des archives

---

## 📚 Prochaines Étapes

1. ✅ Configurez les secrets (vous venez de le faire !)
2. ✅ Testez le déploiement
3. 📖 Lisez `DEPLOYMENT-AUTO.md` pour le workflow quotidien
4. 🚀 Développez et déployez en toute simplicité !

---

## 🔗 Liens Rapides

- **Repository:** https://github.com/Handsome072/maka
- **GitHub Actions:** https://github.com/Handsome072/maka/actions
- **Settings → Secrets:** https://github.com/Handsome072/maka/settings/secrets/actions
- **Site Production:** https://homiqio.com/
- **cPanel o2switch:** https://wasabi.o2switch.net:2083/

