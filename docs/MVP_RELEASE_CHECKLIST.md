# Release Checklist

Use this before shipping a meaningful update.

## Commands

- [ ] `npm run jobs:validate`
- [ ] `npm test`
- [ ] `npm run test:e2e`
- [ ] `npm run build`

## Product

- [ ] Homepage title is `Shane's Job List`
- [ ] Disclaimer is visible near the top
- [ ] Jobs are Product, Design, and Engineering-adjacent
- [ ] Job cards show title, location, company, discipline, and apply link
- [ ] Apply links are role-specific source ATS links
- [ ] Getro/8VC scrape failures, if present, are visible in metadata

## Safety

- [ ] No credentials or secrets
- [ ] No gated scraping
- [ ] No applicant forms or resume uploads
- [ ] No analytics, telemetry, cookies, or tracking pixels

## Design

- [ ] DefSimple-inspired dark visual direction is intact
- [ ] Focus states are visible
- [ ] Reduced-motion carousel behavior works
- [ ] Mobile layout has no overlapping text or controls
