# AGENTS.md - Shane's Job List

## Project Summary

Shane's Job List is an unofficial side project by Shane Quinlan. It is a static browser app for browsing Product, Design, and Engineering roles at Lyntris and selected defense technology companies.

This is not an official recruiting site for Lyntris or any listed company.

## Core Constraints

- Static browser app
- No login
- No backend service
- No hosted database
- No required environment variables
- No secrets
- No applicant data collection
- No analytics or telemetry unless explicitly requested later
- No credentialed or gated scraping
- Apache-2.0 repo

Preferred stack:

- Vite
- React
- TypeScript
- Plain CSS
- Vitest
- Playwright

Avoid Next.js, server-side rendering, route handlers, databases, auth, and heavy UI frameworks unless a later issue explicitly changes the architecture.

## Source Documents

Before making changes, read:

- `docs/PRD.md`
- `docs/DESIGN.md`
- `docs/WORKFLOW.md`
- `docs/workflows/feature-development.md`
- `docs/SCRAPING.md`
- this file

`GITHUB_ISSUES.md` may not exist. If it is absent, use Shane's latest request as the active priority.

## Data Model

The app reads jobs from:

```text
public/jobs.json
```

Required job fields:

- `id`
- `title`
- `location`
- `company`
- `applyUrl`
- `sourceUrl`
- `sourceSystem`
- `lastSeenAt`

Optional fields:

- `discipline`: `Product`, `Design`, or `Engineering`
- `department`

## Role Scope

Keep the board focused on the product trio:

- Product
- Design
- Engineering

Include roles such as Product Manager, Technical Product Manager, Mission Manager, Solutions Architect, Product Designer, Brand Designer, Design Engineer, Software Engineer, Platform Engineer, Developer, and Engineering Manager.

Filter out sales, recruiting, HR, finance, general operations, and back-office roles unless a title clearly matches the product-trio scope.

## Source Rules

Configured public sources include:

- Lyntris public Rippling board
- Rise8 Greenhouse
- Second Front Systems Ashby
- Defense Unicorns Greenhouse
- Vannevar Labs Greenhouse
- 8VC Getro URLs for design/product/engineer searches

Getro currently returns `403` to unauthenticated automated fetches. Keep that visible in metadata. Do not use credentials or private API access unless Shane explicitly provides an approved path.

## UI Requirements

The app should include:

- `Shane's Job List` title
- Hero carousel using committed images
- Prominent unofficial disclaimer visible early
- Last updated timestamp
- One text filter
- Job count
- Job cards showing title, location, company, discipline, optional department, and apply link
- Footer with Shane profile image, LinkedIn, and email

External apply links must use:

```html
target="_blank" rel="noopener noreferrer"
```

## Visual Direction

Use the DefSimple-inspired direction in `docs/DESIGN.md`:

- dark technical/defense style
- high contrast
- black/carbon/graphite surfaces
- bone/sand text
- amber focus/accent
- signal red apply actions
- compact operational labels

Do not imply official brand ownership.

## Verification

Run:

```bash
npm run jobs:validate
npm test
npm run test:e2e
npm run build
```

If a command cannot be run, explain why.
