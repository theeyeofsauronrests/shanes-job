# Deployment Guide

Shane's Job List is a static Vite app. Any static host that can serve `dist/` works.

## Requirements

- No backend server
- No database
- No environment variables
- No secrets
- No server-side runtime

## Build

```bash
npm run build
```

The build writes static files to `dist/`.

## GitHub Pages

The repository includes `.github/workflows/deploy.yml`.

1. Set GitHub Pages source to GitHub Actions.
2. Push to `main`.
3. The workflow runs tests and builds the site.

## Netlify Or Vercel

Use these settings:

```text
Build command: npm run build
Publish directory: dist
```

## Job Refresh

Public board refresh is separate from deployment:

```bash
npm run scrape
npm run jobs:validate
```

The manual GitHub Action `.github/workflows/scrape-jobs.yml` can commit updated `public/jobs.json` and `public/api/` files.

## Verification

After deployment, check:

- Homepage title is `Shane's Job List`
- Disclaimer is visible near the top
- Carousel images load
- Job cards render
- Search filters by role, location, company, and discipline
- Apply links open source ATS pages in a new tab
- Footer shows Shane's profile image, LinkedIn, and email
