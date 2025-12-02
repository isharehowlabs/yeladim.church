#!/bin/bash
echo "🚀 Building and deploying Children's Church App..."

# Step 1: Save source index.html if it's a source file
if [ -f "index.html" ] && grep -q "src/main.jsx" index.html; then
    echo "✓ Source index.html detected"
    SOURCE_HTML_EXISTS=1
else
    SOURCE_HTML_EXISTS=0
fi

# Step 2: Clear old build cache
echo "🧹 Clearing build cache..."
rm -rf dist
rm -rf node_modules/.vite
echo "✅ Build cache cleared"
echo ""

# Step 3: Clear old deployed files
echo "🧹 Clearing old deployed assets..."
rm -f assets/*.js assets/*.css 2>/dev/null
# Remove deployed index.html (will be replaced by build)
if [ $SOURCE_HTML_EXISTS -eq 0 ]; then
    rm -f index.html
fi
echo "✅ Old deployed assets cleared"
echo ""

# Step 4: Restore source index.html if needed
if [ $SOURCE_HTML_EXISTS -eq 0 ]; then
    cat << 'HTMLEOF' > index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Children's Church - Yeladim Church</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
HTMLEOF
fi

# Step 5: Build the app
echo "🔨 Building new files..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📦 Deploying to web server..."
    
    # Step 6: Copy built files to current directory (public_html)
    cp -r dist/assets/* assets/ 2>/dev/null
    cp dist/index.html . 2>/dev/null
    
    # Step 7: Fix ownership and permissions
    echo "🔒 Setting permissions..."
    chown -R ishaglcy:ishaglcy index.html assets .htaccess 2>/dev/null
    chmod 644 index.html .htaccess 2>/dev/null
    chmod 755 assets 2>/dev/null
    chmod 644 assets/* 2>/dev/null
    
    echo "✅ Deployment complete!"
    echo ""
    echo "🌐 Your app is now live at: https://yeladim.church"
    echo ""
    echo "📁 Deployed files:"
    echo "   - index.html (root)"
    echo "   - assets/ ($(ls -1 assets/*.js assets/*.css 2>/dev/null | wc -l) files)"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
