# Deployment Guide

Lyntris Jobs is a static web application that can be deployed to any static hosting service.

## Requirements

- No backend server required
- No environment variables required
- No secrets or API keys
- No database or external services
- Pure client-side JavaScript application

## Build Command

```bash
npm run build
```

This creates a `dist/` directory containing all static files ready for deployment.

## Deployment Options

### Option 1: GitHub Pages (Recommended)

GitHub Pages provides free static hosting directly from the repository.

**Setup:**

1. Push your repository to GitHub
2. Go to repository Settings → Pages
3. Set source to "GitHub Actions"
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**Access:** Your site will be available at `https://<username>.github.io/<repo-name>/`

**Updates:** Push to `main` branch to automatically deploy updates

### Option 2: Netlify

Netlify provides free static hosting with automatic deployments.

**Setup:**

1. Sign up at [netlify.com](https://www.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click "Deploy site"

**Access:** Netlify provides a URL like `https://<random-name>.netlify.app`

**Custom domain:** Configure in Site settings → Domain management

**Updates:** Netlify automatically deploys when you push to your repository

### Option 3: Vercel

Vercel provides free static hosting optimized for modern web apps.

**Setup:**

1. Sign up at [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click "Deploy"

**Access:** Vercel provides a URL like `https://<project-name>.vercel.app`

**Custom domain:** Configure in Project Settings → Domains

**Updates:** Vercel automatically deploys when you push to your repository

### Option 4: Manual Upload

For any static hosting service (AWS S3, Cloudflare Pages, etc.):

1. Run `npm run build` locally
2. Upload the entire `dist/` directory to your hosting service
3. Configure the service to serve `index.html` for all routes

## Verification Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] Hero carousel displays and auto-advances
- [ ] Job count shows correct number
- [ ] Search filter works across all jobs
- [ ] Apply links open correct URLs in new tabs
- [ ] Footer displays with profile image and contact links
- [ ] Disclaimer is visible on page load
- [ ] Last updated timestamp is correct
- [ ] All images load (hero carousel, profile)
- [ ] Mobile responsive layout works

## Updating Job Data

To update job listings after deployment:

1. Edit `data/jobs.csv` with current job listings
2. Run `npm run jobs:import` to generate `public/jobs.json`
3. Commit both files:
   ```bash
   git add data/jobs.csv public/jobs.json
   git commit -m "Update job listings"
   git push
   ```
4. Deployment service automatically rebuilds and deploys

## Build Output Structure

```
dist/
├── index.html          # Main HTML file
├── assets/             # Bundled CSS and JS
│   ├── index-[hash].css
│   └── index-[hash].js
├── jobs.json           # Job data (copied from public/)
├── hero1.png           # Carousel image 1
├── hero2.png           # Carousel image 2
├── hero3.png           # Carousel image 3
├── shane.png           # Profile image
├── favicon.svg         # Site favicon
└── icons.svg           # Icon sprite sheet
```

## Performance Considerations

The built application is optimized for static hosting:

- **Total size:** ~15 MB (includes 4 high-res images)
- **CSS:** ~8.5 KB (gzipped: 2.4 KB)
- **JS:** ~196 KB (gzipped: 62 KB)
- **Jobs data:** ~43 KB (92 jobs)

**Optimization opportunities:**
- Image optimization: Hero images are large PNGs that could be converted to WebP or optimized
- Code splitting: Currently single JS bundle, could split by route if needed
- CDN: Use a CDN for faster global delivery

## Security Headers

Consider adding these security headers in your hosting service:

```
Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

Most static hosting services allow configuring headers via:
- GitHub Pages: Not supported
- Netlify: `netlify.toml` or `_headers` file
- Vercel: `vercel.json`
- Cloudflare Pages: `_headers` file

## Troubleshooting

### Jobs not showing

- Verify `public/jobs.json` exists and contains job data
- Check browser console for fetch errors
- Ensure `jobs.json` is in the root of `dist/` after build

### Images not loading

- Verify images exist in `public/` directory
- Check image paths in components match public file names
- Ensure Vite copies public assets during build

### Deployment fails

- Verify Node.js version is 18+ (check hosting service docs)
- Ensure all dependencies are in `package.json` (no local-only packages)
- Check build command runs successfully locally
- Review hosting service build logs for specific errors

## No Environment Variables Required

This application is designed to work without any environment variables:

- ✅ No API keys
- ✅ No backend URLs
- ✅ No authentication tokens
- ✅ No analytics tracking IDs

All configuration is built into the application or loaded from `jobs.json`.
