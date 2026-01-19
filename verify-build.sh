#!/bin/bash

# Script de vérification du build avant déploiement
# Usage: ./verify-build.sh

set -e

echo "🔍 Vérification du build HOMIQIO..."

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
ERRORS=0
WARNINGS=0

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  VÉRIFICATION DU BUILD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Vérifier que le dossier out existe
echo -n "📁 Vérification du dossier out... "
if [ -d "out" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}   Le dossier 'out' n'existe pas. Exécutez: npm run deploy:prepare${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 2. Vérifier que index.html existe
echo -n "📄 Vérification de index.html... "
if [ -f "out/index.html" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}   Le fichier 'out/index.html' n'existe pas${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 3. Vérifier que .htaccess existe
echo -n "⚙️  Vérification de .htaccess... "
if [ -f "out/.htaccess" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}   Le fichier 'out/.htaccess' n'existe pas${NC}"
    echo -e "${YELLOW}   Exécutez: cp public/.htaccess out/.htaccess${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 4. Vérifier que le dossier _next existe
echo -n "📦 Vérification du dossier _next... "
if [ -d "out/_next" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}   Le dossier 'out/_next' n'existe pas${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 5. Vérifier que les assets existent
echo -n "🖼️  Vérification des assets... "
if [ -f "out/logo.png" ] && [ -f "out/favicon.ico" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo -e "${YELLOW}   Certains assets sont manquants${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# 6. Vérifier la taille du build
echo -n "📊 Vérification de la taille du build... "
BUILD_SIZE=$(du -sh out | cut -f1)
echo -e "${BLUE}$BUILD_SIZE${NC}"

# 7. Vérifier que l'archive existe
echo -n "📦 Vérification de l'archive de déploiement... "
if [ -f "homiqio-deploy.zip" ]; then
    ARCHIVE_SIZE=$(ls -lh homiqio-deploy.zip | awk '{print $5}')
    echo -e "${GREEN}✓ ($ARCHIVE_SIZE)${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo -e "${YELLOW}   L'archive 'homiqio-deploy.zip' n'existe pas${NC}"
    echo -e "${YELLOW}   Exécutez: cd out && zip -r ../homiqio-deploy.zip . && cd ..${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# 8. Compter les pages générées
echo -n "📄 Nombre de pages générées... "
HTML_COUNT=$(find out -name "index.html" | wc -l | tr -d ' ')
echo -e "${BLUE}$HTML_COUNT pages${NC}"

# 9. Vérifier les routes principales
echo ""
echo "🔍 Vérification des routes principales:"
ROUTES=("index.html" "services/index.html" "experiences/index.html" "search/index.html" "booking/index.html" "404.html")
for route in "${ROUTES[@]}"; do
    echo -n "   /$route... "
    if [ -f "out/$route" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

# 10. Vérifier le contenu de .htaccess
echo ""
echo -n "🔧 Vérification du contenu de .htaccess... "
if [ -f "out/.htaccess" ]; then
    if grep -q "RewriteEngine On" out/.htaccess; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        echo -e "${RED}   Le fichier .htaccess ne contient pas 'RewriteEngine On'${NC}"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Résumé
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  RÉSUMÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Tout est prêt pour le déploiement !${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "1. Consultez DEPLOY-NOW.md pour les instructions détaillées"
    echo "2. Uploadez homiqio-deploy.zip via cPanel File Manager"
    echo "3. Décompressez l'archive dans le dossier homiqio.com"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS avertissement(s) détecté(s)${NC}"
    echo -e "${GREEN}✅ Le build est prêt mais vérifiez les avertissements ci-dessus${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ $ERRORS erreur(s) détectée(s)${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS avertissement(s) détecté(s)${NC}"
    fi
    echo ""
    echo "Corrigez les erreurs avant de déployer."
    echo "Exécutez: npm run deploy:prepare"
    echo ""
    exit 1
fi

