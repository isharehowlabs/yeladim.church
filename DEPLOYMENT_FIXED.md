# Deployment Script Improvements

## Problem Fixed
The deployment scripts were not properly cleaning up old build files before deploying new ones, causing:
- Accumulation of old JS and CSS files in the assets directory
- Potential confusion about which files were actually being served
- Wasted disk space

## Solution Implemented

### Updated Scripts
Both `deploy.sh` and `build-and-deploy.sh` have been updated to:

1. **Clear old deployed assets** - Delete only `.js` and `.css` files from assets directory before building
2. **Clear build cache** - Remove `dist/` and `node_modules/.vite` for clean builds
3. **Build fresh** - Run `npm run build` to generate new files
4. **Auto-deploy** - Automatically copy built files to the deployment location
5. **Set permissions** - Ensure proper file ownership and permissions

### Key Improvements

#### Before
- Old build files accumulated (19+ old JS/CSS files)
- Manual deployment step required after build
- Risk of serving stale files

#### After
- Only current build files (3 files: 1 JS, 1 CSS, 1 generated CSS)
- Automatic deployment after successful build
- Clean deployment directory every time

## Usage

### Quick Deploy (No Git Operations)
```bash
./deploy.sh
```

This will:
1. Clean old files
2. Build new files
3. Deploy automatically
4. Set permissions

### Full Build and Deploy (With Git)
```bash
./build-and-deploy.sh
```

This will:
1. Clean old files
2. Build new files
3. Deploy automatically
4. Commit changes to git
5. Push to remote repository

## Verification

After deployment, you can verify:
```bash
# Check deployed files
ls -la assets/

# Check site is live
curl -I https://yeladim.church
```

You should see only 3 files in the assets directory after deployment.

## Notes

- The source `index.html` is now properly preserved during deployment
- Old build artifacts are cleaned before each build
- Deployment happens automatically after successful build
- The site goes live immediately after deployment completes
