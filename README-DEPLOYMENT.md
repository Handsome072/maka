# 🚀 Déploiement Automatique HOMIQIO

## 📋 Résumé

Votre projet Next.js HOMIQIO est maintenant configuré pour un **déploiement automatique** vers o2switch via GitHub Actions.

---

## ✅ Ce qui a été fait

### 1. Configuration du Workflow GitHub Actions
- ✅ Fichier `.github/workflows/deploy.yml` créé
- ✅ Workflow configuré pour se déclencher sur chaque push vers `main`
- ✅ Build automatique avec `npm run deploy:prepare`
- ✅ Déploiement FTP automatique vers `homiqio.com/`

### 2. Scripts de Déploiement
- ✅ `deploy-ftp-auto.sh` - Script de déploiement FTP local
- ✅ Scripts npm configurés dans `package.json`

### 3. Documentation Complète
- ✅ `DEPLOYMENT-AUTO.md` - Guide d'utilisation quotidien
- ✅ `GITHUB-ACTIONS-SETUP.md` - Guide de configuration détaillé
- ✅ `CONFIGURATION-SECRETS.md` - Guide de configuration des secrets
- ✅ `README-DEPLOYMENT.md` - Ce fichier (résumé)

### 4. Configuration Git
- ✅ `.gitignore` mis à jour pour exclure les archives
- ✅ Tous les fichiers committés et poussés sur GitHub

---

## ⚠️ ACTION REQUISE: Configurer les Secrets GitHub

**Le déploiement automatique ne fonctionnera pas tant que vous n'aurez pas configuré les secrets FTP.**

### 🔐 Étapes Rapides:

1. **Allez sur GitHub:**
   - https://github.com/Handsome072/maka/settings/secrets/actions

2. **Ajoutez 3 secrets:**
   - `FTP_SERVER` → `ftp.homiqio.com`
   - `FTP_USERNAME` → Votre nom d'utilisateur FTP (ex: `homiqio@homiqio.com`)
   - `FTP_PASSWORD` → Votre mot de passe FTP

3. **Testez le déploiement:**
   - Allez dans Actions → Deploy to o2switch → Run workflow

📖 **Guide détaillé:** Consultez `CONFIGURATION-SECRETS.md`

---

## 🔄 Workflow de Développement

### Avant (Manuel)
```bash
# 1. Modifier le code
# 2. Build
npm run deploy:prepare

# 3. Créer un ZIP
cd out && zip -r ../homiqio-deploy.zip .

# 4. Se connecter à cPanel
# 5. Uploader le ZIP
# 6. Extraire le ZIP
# 7. Vérifier le site
```

### Maintenant (Automatique)
```bash
# 1. Modifier le code
# 2. Committer et pousser
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 3. Attendre 3-5 minutes
# → Le site est automatiquement mis à jour ! 🎉
```

---

## 📊 Processus de Déploiement

Chaque push vers `main` déclenche automatiquement:

1. **📥 Checkout code** (~10s)
2. **🔧 Setup Node.js** (~20s)
3. **📦 Install dependencies** (~1-2min)
4. **🏗️ Build Next.js** (~1-2min)
5. **📋 Verify build** (~5s)
6. **🚀 Deploy via FTP** (~1-2min)
7. **✅ Complete** (~5s)

**Temps total: 3-5 minutes**

---

## 📚 Documentation

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| `CONFIGURATION-SECRETS.md` | Configuration des secrets GitHub | **À FAIRE MAINTENANT** |
| `DEPLOYMENT-AUTO.md` | Guide d'utilisation quotidien | Tous les jours |
| `GITHUB-ACTIONS-SETUP.md` | Configuration détaillée | Référence |
| `.github/workflows/deploy.yml` | Workflow GitHub Actions | Modification avancée |
| `deploy-ftp-auto.sh` | Script de déploiement local | Test local |

---

## 🎯 Avantages

| Avant | Maintenant |
|-------|------------|
| ❌ 10-15 minutes par déploiement | ✅ 3-5 minutes automatiques |
| ❌ 7 étapes manuelles | ✅ 1 commande: `git push` |
| ❌ Risque d'erreur humaine | ✅ Processus fiable et reproductible |
| ❌ Pas d'historique | ✅ Historique complet dans GitHub Actions |
| ❌ Gestion manuelle des fichiers | ✅ Déploiement automatique |

---

## 🔗 Liens Rapides

- **Repository:** https://github.com/Handsome072/maka
- **GitHub Actions:** https://github.com/Handsome072/maka/actions
- **Configurer Secrets:** https://github.com/Handsome072/maka/settings/secrets/actions
- **Site Production:** https://homiqio.com/
- **cPanel o2switch:** https://wasabi.o2switch.net:2083/

---

## 🚀 Prochaines Étapes

### 1. Configuration Initiale (À FAIRE MAINTENANT)
- [ ] Lire `CONFIGURATION-SECRETS.md`
- [ ] Configurer les 3 secrets GitHub (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD)
- [ ] Tester le déploiement manuellement dans GitHub Actions

### 2. Premier Déploiement Automatique
- [ ] Faire une petite modification dans le code
- [ ] Committer: `git commit -m "test: Premier déploiement automatique"`
- [ ] Pousser: `git push origin main`
- [ ] Vérifier dans GitHub Actions que le déploiement fonctionne
- [ ] Vérifier sur https://homiqio.com/ que le site est mis à jour

### 3. Utilisation Quotidienne
- [ ] Lire `DEPLOYMENT-AUTO.md` pour le workflow quotidien
- [ ] Développer normalement
- [ ] Pousser sur `main` pour déployer automatiquement

---

## 🐛 Problèmes Courants

### Le workflow ne se déclenche pas
- Vérifiez que vous avez poussé sur la branche `main`
- Vérifiez que le fichier `.github/workflows/deploy.yml` existe sur GitHub

### Erreur "FTP connection failed"
- Vérifiez que les 3 secrets sont configurés dans GitHub
- Testez la connexion FTP avec FileZilla
- Consultez `CONFIGURATION-SECRETS.md` section Dépannage

### Le build échoue
- Vérifiez les logs dans GitHub Actions
- Testez le build localement: `npm run deploy:prepare`

---

## 📞 Support

1. **Consultez la documentation:**
   - `CONFIGURATION-SECRETS.md` pour la configuration
   - `DEPLOYMENT-AUTO.md` pour l'utilisation
   - `GITHUB-ACTIONS-SETUP.md` pour les détails techniques

2. **Vérifiez les logs:**
   - GitHub Actions: https://github.com/Handsome072/maka/actions

3. **Testez localement:**
   ```bash
   npm run deploy:prepare
   ```

4. **Contactez le support o2switch:**
   - Si problème de connexion FTP
   - Si problème d'accès au serveur

---

## 🎉 Conclusion

Votre projet HOMIQIO est maintenant configuré pour un déploiement automatique professionnel !

**Prochaine étape:** Configurez les secrets GitHub en suivant `CONFIGURATION-SECRETS.md`

Bon développement ! 🚀

