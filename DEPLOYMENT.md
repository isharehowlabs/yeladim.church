# Deployment Guide

## Quick Start (Development)

To run the app in development mode:

```bash
./start.sh
```

Or manually:
```bash
npm run dev
```

Access at: `http://localhost:5173`

## Production Deployment

### Option 1: Automated Deployment (Recommended)

Run the deployment script:
```bash
./deploy.sh
```

This will:
1. Build the production version
2. Copy files to the web root
3. Set up proper routing with .htaccess

### Option 2: Manual Deployment

1. Build the production version:
```bash
npm run build
```

2. Copy the contents of the `dist/` folder to your web root:
```bash
cp -r dist/* .
```

3. Ensure `.htaccess` is in place for proper routing

## Accessing the App

Once deployed, your app will be available at:
- **Production**: https://yeladim.church
- **Development**: http://localhost:5173

## Directory Structure

```
yeladim.church/
├── src/
│   ├── components/
│   │   ├── VideoStream.jsx      # Video streaming component
│   │   ├── DrawingPad.jsx       # Drawing pad for children
│   │   ├── Quiz.jsx             # Quiz system (teacher/student)
│   │   └── ScriptureNotebook.jsx # Scripture lesson notes
│   ├── App.jsx                  # Main app with tab navigation
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles (Tailwind)
├── dist/                        # Production build output
├── public/                      # Static assets
├── .htaccess                    # Apache configuration
├── start.sh                     # Development start script
├── deploy.sh                    # Deployment script
├── package.json                 # Dependencies
└── README.md                    # Documentation

```

## Updating the App

To make changes and redeploy:

1. Edit the source files in `src/`
2. Test locally: `npm run dev`
3. Deploy: `./deploy.sh`

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Port Already in Use
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

### .htaccess Not Working
Ensure `mod_rewrite` is enabled on your Apache server:
```bash
a2enmod rewrite
systemctl restart apache2
```

## Features Overview

### 📺 Video Streaming
- Supports YouTube (public/private streams)
- Supports Discord embeds
- Easy stream switching

### 🎨 Drawing Pad
- HTML5 canvas drawing
- 10 colors, adjustable brush size
- Save as PNG
- Touch-enabled

### ❓ Quiz System
- Teacher mode: Create/manage questions
- Student mode: Answer and track score
- Supports multiple choice and true/false
- LocalStorage persistence

### 📖 Scripture Notebook
- Create lesson notes with scripture references
- Export and print lessons
- LocalStorage persistence
- Multi-lesson management

## Support

For issues or questions, check the main README.md file.
