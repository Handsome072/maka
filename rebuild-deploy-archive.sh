#!/bin/bash

# Script to rebuild the deployment archive with latest changes
# This includes the new shadow effects for login and signup forms

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     HOMIQIO - Rebuild Deployment Archive                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Clean previous build
echo -e "${BLUE}📦 Step 1/4: Cleaning previous build...${NC}"
if [ -d "out" ]; then
    rm -rf out
    echo "   ✓ Removed old 'out' directory"
fi
if [ -f "homiqio-deploy.zip" ]; then
    rm -f homiqio-deploy.zip
    echo "   ✓ Removed old deployment archive"
fi
echo ""

# Step 2: Build the project
echo -e "${BLUE}🔨 Step 2/4: Building Next.js project...${NC}"
echo "   Running: npm run deploy:prepare"
npm run deploy:prepare

if [ ! -d "out" ]; then
    echo -e "${RED}❌ Error: Build failed - 'out' directory not created${NC}"
    exit 1
fi
echo "   ✓ Build completed successfully"
echo ""

# Step 3: Create the deployment archive
echo -e "${BLUE}📦 Step 3/4: Creating deployment archive...${NC}"
echo "   Running: npm run deploy:zip"
npm run deploy:zip

if [ ! -f "homiqio-deploy.zip" ]; then
    echo -e "${RED}❌ Error: Archive creation failed${NC}"
    exit 1
fi

ARCHIVE_SIZE=$(ls -lh homiqio-deploy.zip | awk '{print $5}')
echo "   ✓ Archive created: homiqio-deploy.zip (${ARCHIVE_SIZE})"
echo ""

# Step 4: Verify the archive structure
echo -e "${BLUE}🔍 Step 4/4: Verifying archive structure...${NC}"

# Check for critical files at root level
CRITICAL_FILES=("index.html" ".htaccess" "404.html" "favicon.ico")
ALL_FOUND=true

for file in "${CRITICAL_FILES[@]}"; do
    if unzip -l homiqio-deploy.zip | grep -q " $file$"; then
        echo "   ✓ $file found at root level"
    else
        echo -e "   ${RED}✗ $file NOT FOUND${NC}"
        ALL_FOUND=false
    fi
done

# Check for 'out/' directory wrapper (should NOT exist)
if unzip -l homiqio-deploy.zip | grep -q "out/"; then
    echo -e "   ${RED}✗ WARNING: Archive contains 'out/' directory wrapper${NC}"
    ALL_FOUND=false
else
    echo "   ✓ No 'out/' directory wrapper (correct structure)"
fi

# Check for login directory (contains shadow effects)
if unzip -l homiqio-deploy.zip | grep -q "login/"; then
    echo "   ✓ Login pages included (with shadow effects ✨)"
else
    echo -e "   ${YELLOW}⚠ Login directory not found${NC}"
fi

echo ""

# Final summary
if [ "$ALL_FOUND" = true ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    ✅ SUCCESS!                                 ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Archive is ready for deployment!${NC}"
    echo ""
    echo "📦 Archive: homiqio-deploy.zip"
    echo "📊 Size: ${ARCHIVE_SIZE}"
    echo "📁 Files: $(unzip -l homiqio-deploy.zip | tail -1 | awk '{print $2}') files"
    echo ""
    echo "✨ Includes:"
    echo "   • Login page with shadow effects"
    echo "   • Signup form with shadow effects"
    echo "   • All static assets and routes"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Login to cPanel: https://wasabi.o2switch.net:2083"
    echo "   2. Navigate to File Manager > homiqio.com"
    echo "   3. Upload homiqio-deploy.zip"
    echo "   4. Extract the archive"
    echo "   5. Verify deployment at https://homiqio.com"
    echo ""
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    ⚠️  WARNING                                 ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Some verification checks failed.${NC}"
    echo "Please review the output above and fix any issues."
    echo ""
    exit 1
fi

