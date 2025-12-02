#!/bin/bash

# Build and Deploy Script
# Clears old build files, builds new ones, then handles git operations

set -e  # Exit on error

echo "🚀 Build and Deploy Script"
echo "=========================="
echo ""

# Step 1: Clear old build files
echo "🧹 Clearing old build files..."
rm -rf dist
rm -rf node_modules/.vite
echo "✅ Old build files cleared"
echo ""

# Step 2: Build new files
echo "🔨 Building new files..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Aborting deployment."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 3: Git operations
echo "📝 Git operations..."
echo ""

# Check if there are changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️  No changes to commit"
else
    echo "📋 Staging changes..."
    git add .
    
    echo ""
    echo "💬 Enter commit message (or press Enter for default):"
    read -r commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Build and deploy: $(date +'%Y-%m-%d %H:%M:%S')"
    fi
    
    echo ""
    echo "📝 Committing changes..."
    git commit -m "$commit_message"
    
    if [ $? -ne 0 ]; then
        echo "❌ Commit failed. Aborting."
        exit 1
    fi
    
    echo "✅ Changes committed"
    echo ""
fi

# Step 4: Push to remote
echo "📤 Pushing to remote..."
if git remote | grep -q "origin"; then
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to remote"
    else
        echo "⚠️  Push failed or no changes to push"
    fi
else
    echo "ℹ️  No remote 'origin' configured. Skipping push."
    echo "   Run ./push-to-github.sh to set up remote"
fi

echo ""
echo "🎉 Build and deploy process complete!"
echo ""
echo "📁 Build files are in ./dist directory"
echo "🌐 Ready for deployment"

