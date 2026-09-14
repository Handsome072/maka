#!/bin/bash

# Script de déploiement pour o2switch
# Usage: ./deploy.sh

set -e

echo "🚀 Démarrage du déploiement Séjoura vers o2switch..."

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration - À PERSONNALISER
SSH_USER="homiqio"
SSH_HOST="wasabi.o2switch.net"
REMOTE_PATH="~/homiqio.com"
LOCAL_BUILD_PATH="./out"

echo -e "${BLUE}📦 Étape 1: Construction du projet...${NC}"
npm run deploy:prepare

if [ ! -d "$LOCAL_BUILD_PATH" ]; then
    echo -e "${RED}❌ Erreur: Le dossier $LOCAL_BUILD_PATH n'existe pas${NC}"
    exit 1
fi

echo -e "${BLUE}📤 Étape 2: Déploiement vers o2switch...${NC}"

# Créer une archive pour un transfert plus rapide
echo "Création de l'archive..."
tar -czf deploy.tar.gz -C out .

# Transférer l'archive
echo "Transfert de l'archive..."
scp deploy.tar.gz ${SSH_USER}@${SSH_HOST}:~/

# Décompresser sur le serveur et nettoyer
echo "Décompression sur le serveur..."
ssh ${SSH_USER}@${SSH_HOST} << 'ENDSSH'
    # Créer un backup de l'ancien site
    if [ -d ~/homiqio.com ]; then
        echo "Création d'un backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        mv ~/homiqio.com ~/homiqio.com.backup_$timestamp
    fi
    
    # Créer le dossier de destination
    mkdir -p ~/homiqio.com
    
    # Décompresser les nouveaux fichiers
    tar -xzf ~/deploy.tar.gz -C ~/homiqio.com/
    
    # Nettoyer l'archive
    rm ~/deploy.tar.gz
    
    # Vérifier les permissions
    chmod -R 755 ~/homiqio.com
    find ~/homiqio.com -type f -exec chmod 644 {} \;
    
    echo "✅ Déploiement terminé sur le serveur"
ENDSSH

# Nettoyer l'archive locale
rm deploy.tar.gz

echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo -e "${GREEN}🌐 Votre site est maintenant disponible sur https://homiqio.com${NC}"

