#!/bin/bash
echo "🚀 Building and deploying Children's Church App..."

# Clear old build files
echo "🧹 Clearing old build files..."
rm -rf dist
rm -rf node_modules/.vite

# Build the app
echo "🔨 Building new files..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📦 Deploying to web server..."
    
    # Copy built files to current directory (public_html)
    cp -r dist/* .
    
    # Fix ownership and permissions
    chown -R ishaglcy:ishaglcy index.html assets .htaccess 2>/dev/null
    chmod 644 index.html .htaccess 2>/dev/null
    chmod 755 assets 2>/dev/null
    chmod 644 assets/* 2>/dev/null
    
    echo "✅ Deployment complete!"
    echo ""
    echo "🌐 Your app should now be accessible at: https://yeladim.church"
    echo ""
    echo "📁 Build files are in the ./dist directory"
    echo "📄 Production files copied to current directory"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
