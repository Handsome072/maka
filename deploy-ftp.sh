#!/bin/bash

# Script de déploiement FTP pour o2switch
# Usage: ./deploy-ftp.sh

set -e

echo "🚀 Démarrage du déploiement HOMIQIO vers o2switch (FTP)..."

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - À PERSONNALISER
FTP_HOST="ftp.homiqio.com"
FTP_USER="homiqio"
REMOTE_PATH="/homiqio.com"
LOCAL_BUILD_PATH="./out"

echo -e "${BLUE}📦 Étape 1: Construction du projet...${NC}"
npm run deploy:prepare

if [ ! -d "$LOCAL_BUILD_PATH" ]; then
    echo -e "${RED}❌ Erreur: Le dossier $LOCAL_BUILD_PATH n'existe pas${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  Pour le déploiement FTP, vous avez plusieurs options:${NC}"
echo ""
echo "Option 1: Utiliser FileZilla ou un client FTP graphique"
echo "  - Hôte: $FTP_HOST"
echo "  - Utilisateur: $FTP_USER"
echo "  - Dossier local: $LOCAL_BUILD_PATH"
echo "  - Dossier distant: $REMOTE_PATH"
echo ""
echo "Option 2: Utiliser le File Manager de cPanel"
echo "  - URL: https://wasabi.o2switch.net:2083/frontend/o2switch/filemanager/index.html"
echo "  - Compresser le dossier 'out' en ZIP"
echo "  - Uploader le ZIP via cPanel"
echo "  - Décompresser dans le dossier homiqio.com"
echo ""
echo "Option 3: Utiliser lftp (si installé)"
echo "  - Installer: brew install lftp (sur macOS)"
echo "  - Puis relancer ce script"
echo ""

# Vérifier si lftp est installé
if command -v lftp &> /dev/null; then
    echo -e "${BLUE}📤 lftp détecté! Déploiement automatique...${NC}"
    read -sp "Mot de passe FTP pour $FTP_USER: " FTP_PASS
    echo ""
    
    lftp -c "
    set ftp:ssl-allow no;
    open -u $FTP_USER,$FTP_PASS $FTP_HOST;
    mirror -R --delete --verbose $LOCAL_BUILD_PATH $REMOTE_PATH;
    bye
    "
    
    echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
else
    echo -e "${YELLOW}💡 Création d'une archive ZIP pour upload manuel...${NC}"
    
    # Créer une archive ZIP
    cd out
    zip -r ../homiqio-deploy.zip .
    cd ..
    
    echo -e "${GREEN}✅ Archive créée: homiqio-deploy.zip${NC}"
    echo ""
    echo "Étapes suivantes:"
    echo "1. Connectez-vous à cPanel: https://wasabi.o2switch.net:2083"
    echo "2. Ouvrez le File Manager"
    echo "3. Naviguez vers le dossier homiqio.com"
    echo "4. Supprimez les anciens fichiers (ou créez un backup)"
    echo "5. Uploadez homiqio-deploy.zip"
    echo "6. Clic droit > Extract"
    echo "7. Vérifiez que le fichier .htaccess est présent"
fi

echo -e "${GREEN}🌐 Votre site sera disponible sur https://homiqio.com${NC}"

