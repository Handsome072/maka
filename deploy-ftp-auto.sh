#!/bin/bash

# Script de déploiement FTP automatisé pour o2switch
# Ce script peut être utilisé pour tester le déploiement localement

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement automatisé vers o2switch"
echo "========================================"
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration FTP
FTP_SERVER="${FTP_SERVER:-ftp.homiqio.com}"
FTP_USER="${FTP_USER:-homiqio@homiqio.com}"
FTP_REMOTE_DIR="/homiqio.com"
LOCAL_DIR="./out"

# Vérifier si les variables d'environnement sont définies
if [ -z "$FTP_PASSWORD" ]; then
    echo -e "${RED}❌ Erreur: La variable FTP_PASSWORD n'est pas définie${NC}"
    echo ""
    echo "Utilisation:"
    echo "  export FTP_SERVER='ftp.homiqio.com'"
    echo "  export FTP_USER='homiqio@homiqio.com'"
    echo "  export FTP_PASSWORD='votre_mot_de_passe'"
    echo "  ./deploy-ftp-auto.sh"
    echo ""
    exit 1
fi

# Étape 1: Build du projet
echo -e "${BLUE}📦 Étape 1/3: Build du projet Next.js${NC}"
echo "Exécution de: npm run deploy:prepare"
npm run deploy:prepare

if [ ! -d "$LOCAL_DIR" ]; then
    echo -e "${RED}❌ Erreur: Le dossier $LOCAL_DIR n'existe pas${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build terminé avec succès${NC}"
echo ""

# Étape 2: Vérification du build
echo -e "${BLUE}📋 Étape 2/3: Vérification du build${NC}"
FILE_COUNT=$(find "$LOCAL_DIR" -type f | wc -l | tr -d ' ')
BUILD_SIZE=$(du -sh "$LOCAL_DIR" | cut -f1)

echo "  - Nombre de fichiers: $FILE_COUNT"
echo "  - Taille du build: $BUILD_SIZE"
echo "  - Fichiers principaux:"
ls -lh "$LOCAL_DIR" | head -10

echo -e "${GREEN}✅ Vérification terminée${NC}"
echo ""

# Étape 3: Déploiement FTP
echo -e "${BLUE}🚀 Étape 3/3: Déploiement FTP vers o2switch${NC}"
echo "  - Serveur: $FTP_SERVER"
echo "  - Utilisateur: $FTP_USER"
echo "  - Dossier distant: $FTP_REMOTE_DIR"
echo ""

# Vérifier si lftp est installé
if ! command -v lftp &> /dev/null; then
    echo -e "${YELLOW}⚠️  lftp n'est pas installé${NC}"
    echo ""
    echo "Installation de lftp:"
    echo "  - macOS: brew install lftp"
    echo "  - Ubuntu/Debian: sudo apt-get install lftp"
    echo "  - CentOS/RHEL: sudo yum install lftp"
    echo ""
    echo -e "${YELLOW}Alternative: Utilisez le workflow GitHub Actions pour le déploiement${NC}"
    exit 1
fi

echo "Connexion au serveur FTP et upload des fichiers..."
echo ""

# Utiliser lftp pour le déploiement
lftp -c "
set ftp:ssl-allow no;
set net:timeout 10;
set net:max-retries 3;
set net:reconnect-interval-base 5;
open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER;
lcd $LOCAL_DIR;
cd $FTP_REMOTE_DIR;
mirror --reverse --delete --verbose --parallel=3 ./ ./;
bye;
"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Déploiement FTP terminé avec succès!${NC}"
    echo ""
    echo "🎉 Votre site est maintenant en ligne sur:"
    echo "   https://homiqio.com/"
    echo ""
    echo "💡 Conseil: Videz le cache de votre navigateur (Ctrl+Shift+R)"
else
    echo ""
    echo -e "${RED}❌ Erreur lors du déploiement FTP${NC}"
    echo ""
    echo "Vérifiez:"
    echo "  - Vos identifiants FTP"
    echo "  - Votre connexion internet"
    echo "  - Les paramètres du serveur FTP"
    exit 1
fi

