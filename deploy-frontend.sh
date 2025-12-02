#!/bin/bash

# Deploy script for Children's Church frontend

echo "🧹 Clearing old build files..."
rm -rf dist
rm -rf node_modules/.vite

echo "🔨 Building frontend..."
npm run build

echo "Copying files to document root..."
cp -r dist/* .

echo "Setting correct permissions..."
chown -R ishaglcy:ishaglcy assets/*.js assets/*.css index.html

echo "Deployment complete!"
echo "Backend API status:"
curl -s http://localhost:3001/health
echo ""
