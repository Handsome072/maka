#!/bin/bash

# ============================================
# Script de déploiement Next.js vers o2switch
# ============================================

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Déploiement HOMIQIO vers o2switch   ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# ============================================
# Étape 1 : Vérifications préalables
# ============================================
echo -e "${YELLOW}📋 Étape 1/5 : Vérifications préalables...${NC}"

if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Erreur : package.json introuvable${NC}"
  echo -e "${RED}   Exécutez ce script depuis la racine du projet${NC}"
  exit 1
fi

if [ ! -f "next.config.ts" ]; then
  echo -e "${RED}❌ Erreur : next.config.ts introuvable${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Fichiers de configuration trouvés${NC}"

# Vérifier que node_modules existe
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}⚠️  node_modules introuvable${NC}"
  echo -e "${YELLOW}   Installation des dépendances...${NC}"
  npm install
fi

echo ""

# ============================================
# Étape 2 : Build de l'application
# ============================================
echo -e "${YELLOW}🔨 Étape 2/5 : Build de l'application Next.js...${NC}"

# Nettoyer les anciens builds
if [ -d "out" ]; then
  echo -e "${BLUE}   Nettoyage de l'ancien build...${NC}"
  rm -rf out
fi

if [ -d ".next" ]; then
  rm -rf .next
fi

# Lancer le build
npm run build

if [ ! -d "out" ]; then
  echo -e "${RED}❌ Erreur : Le dossier 'out' n'a pas été généré${NC}"
  echo -e "${RED}   Vérifiez que next.config.ts contient 'output: export'${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Build réussi - Dossier 'out' généré${NC}"
echo ""

# ============================================
# Étape 3 : Copier .htaccess dans out/
# ============================================
echo -e "${YELLOW}📄 Étape 3/5 : Copie du fichier .htaccess...${NC}"

if [ -f ".htaccess" ]; then
  cp .htaccess out/.htaccess
  echo -e "${GREEN}✅ .htaccess copié dans out/${NC}"
else
  echo -e "${RED}⚠️  Fichier .htaccess introuvable${NC}"
  echo -e "${YELLOW}   Créez-le manuellement dans cPanel après l'upload${NC}"
fi

echo ""

# ============================================
# Étape 4 : Création de l'archive
# ============================================
echo -e "${YELLOW}📦 Étape 4/5 : Création de l'archive de déploiement...${NC}"

# Supprimer l'ancienne archive si elle existe
if [ -f "homiqio-deploy.zip" ]; then
  rm homiqio-deploy.zip
fi

# Créer l'archive depuis le dossier out/
cd out
zip -r ../homiqio-deploy.zip . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

# Vérifier la taille de l'archive
ARCHIVE_SIZE=$(du -h homiqio-deploy.zip | cut -f1)
echo -e "${GREEN}✅ Archive créée : homiqio-deploy.zip (${ARCHIVE_SIZE})${NC}"
echo ""

# ============================================
# Étape 5 : Instructions de déploiement
# ============================================
echo -e "${YELLOW}📤 Étape 5/5 : Instructions de déploiement${NC}"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           PROCHAINES ÉTAPES (Manuel cPanel)               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}1.${NC} Connectez-vous à cPanel :"
echo -e "   ${BLUE}https://wasabi.o2switch.net:2083/${NC}"
echo ""
echo -e "${GREEN}2.${NC} Ouvrez ${YELLOW}File Manager${NC}"
echo ""
echo -e "${GREEN}3.${NC} Naviguez vers le dossier ${YELLOW}homiqio.com/${NC}"
echo ""
echo -e "${GREEN}4.${NC} ${RED}IMPORTANT${NC} : Supprimez tous les fichiers existants dans ce dossier"
echo -e "   (notamment l'ancien index.html de test)"
echo ""
echo -e "${GREEN}5.${NC} Cliquez sur ${YELLOW}Upload${NC} (en haut)"
echo ""
echo -e "${GREEN}6.${NC} Sélectionnez le fichier :"
echo -e "   ${BLUE}$(pwd)/homiqio-deploy.zip${NC}"
echo ""
echo -e "${GREEN}7.${NC} Une fois uploadé, ${YELLOW}clic droit${NC} sur homiqio-deploy.zip"
echo -e "   → Sélectionnez ${YELLOW}Extract${NC}"
echo ""
echo -e "${GREEN}8.${NC} Vérifiez que l'extraction s'est faite dans ${YELLOW}homiqio.com/${NC}"
echo -e "   (pas dans un sous-dossier)"
echo ""
echo -e "${GREEN}9.${NC} Supprimez le fichier ${YELLOW}homiqio-deploy.zip${NC} du serveur"
echo ""
echo -e "${GREEN}10.${NC} Vérifiez les permissions :"
echo -e "    - Dossiers : ${YELLOW}755${NC}"
echo -e "    - Fichiers : ${YELLOW}644${NC}"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  VÉRIFICATION FINALE                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Testez ces URLs :${NC}"
echo -e "  ✓ ${BLUE}https://homiqio.com/${NC}"
echo -e "  ✓ ${BLUE}https://homiqio.com/experiences/${NC}"
echo -e "  ✓ ${BLUE}https://homiqio.com/services/${NC}"
echo -e "  ✓ ${BLUE}https://homiqio.com/property/1/${NC}"
echo -e "  ✓ ${BLUE}https://homiqio.com/client-space/${NC}"
echo ""
echo -e "${GREEN}✅ Préparation terminée !${NC}"
echo -e "${YELLOW}📦 Fichier prêt : homiqio-deploy.zip${NC}"
echo ""

