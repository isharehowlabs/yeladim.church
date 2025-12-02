# Deployment Guide

## Quick Deploy

You can now deploy with a single command:

```bash
npm run deploy
```

This will:
1. ✅ Clear old build cache
2. ✅ Remove old deployed assets (JS & CSS files)
3. ✅ Build fresh production files
4. ✅ Automatically deploy to the live site
5. ✅ Set proper file permissions

## What's Fixed

### Automatic Deployment
- No more manual steps after building
- Single command deployment: `npm run deploy`
- Automatic cleanup of old build files

### Video Frame Responsiveness
- Video now properly scales to fit container width
- Uses `aspect-video` (16:9) ratio that works on all devices
- Added `max-w-full` and `overflow-hidden` to prevent horizontal overflow
- Video maintains proper aspect ratio on mobile, tablet, and desktop

### Before & After

**Before:**
- Had to run `./deploy.sh` manually
- Video might overflow on narrow devices
- Old build files accumulated (19+ files)

**After:**
- Just run `npm run deploy`
- Video is fully responsive and contained
- Only 3 current build files exist

## Verification

After deployment, check:

```bash
# Verify only 3 files in assets
ls -l assets/

# Check site is live
curl -I https://yeladim.church
```

You should see:
- HTTP 200 OK response
- Only 3 files in assets directory
- Site loads properly on all devices

## Notes

- The deploy script handles source vs. built `index.html` automatically
- Old JS and CSS files are cleaned before each deployment
- Site goes live immediately after successful build
