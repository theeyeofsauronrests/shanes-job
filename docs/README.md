# Lyntris Jobs Documentation

Documentation for the unofficial Lyntris-transition jobs board side project by Shane Quinlan.

## Files

### Planning & Design

- `DESIGN.md` — product architecture, source constraints, data model, UI direction, and skill guidance
- `PRD.md` — simple MVP requirements and acceptance criteria
- `WORKFLOW.md` — root workflow manifest using a Flowz-style two-tier workflow structure
- `workflows/feature-development.md` — detailed issue-to-merge workflow

### Deployment & Operations

- `DEPLOYMENT.md` — deployment guide for GitHub Pages, Netlify, Vercel, and manual hosting
- `../data/README.md` — manual CSV import guide for job data

## Architecture

The app is a static React/TypeScript single-page application:

- **Frontend:** Vite + React 19 + TypeScript 6
- **Styling:** Plain CSS with Lyntris brand design (Black, Ultra Violet, Space Grotesk fonts)
- **Data:** Static `jobs.json` file generated from manual CSV import
- **Hosting:** Any static file host (GitHub Pages, Netlify, Vercel)
- **No backend:** No server, no database, no environment variables required

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

Quick start:

```bash
npm run build          # Creates dist/ with static files
```

Deploy `dist/` to any static hosting service.
