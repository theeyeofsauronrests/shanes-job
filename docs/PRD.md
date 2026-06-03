# PRD.md - Shane's Job List

## Summary

Shane's Job List is an unofficial static web app for browsing Product, Design, and Engineering roles at Lyntris and selected defense technology companies.

It is maintained by Shane Quinlan as a side project. It is not an official recruiting site for Lyntris or any listed company.

## Problem

Defense technology roles are scattered across company-specific ATS boards. Shane wants one lightweight list focused on the product trio: the product managers, designers, and engineers he works with every day.

## Users

- Product, Design, and Engineering candidates interested in defense tech
- Product team peers who want a quick way to share relevant roles
- Shane as the maintainer

## Scope

The app must:

- Stay static and browser-only
- Read jobs from `public/jobs.json`
- Show roles from Lyntris and selected defense technology companies
- Filter to Product, Design, and Engineering-adjacent roles
- Link directly to source ATS pages
- Make the unofficial status obvious
- Avoid applicant data collection, tracking, accounts, backend services, databases, and secrets

## Sources

Initial public sources:

- Lyntris public Rippling board: `https://ats.rippling.com/accelintjobboardtest/jobs`
- 8VC Getro search URLs:
  - `https://jobs.8vc.com/jobs?q=design`
  - `https://jobs.8vc.com/jobs?q=product`
  - `https://jobs.8vc.com/jobs?q=engineer`
- Rise8 Greenhouse: `https://job-boards.greenhouse.io/rise8`
- Second Front Systems Ashby: `https://jobs.ashbyhq.com/Second-Front-Systems`
- Defense Unicorns Greenhouse: `https://job-boards.greenhouse.io/defenseunicorns`
- Vannevar Labs Greenhouse: `https://job-boards.greenhouse.io/vannevarlabs`

Getro currently returns `403` to unauthenticated automated fetches for the 8VC URLs. Keep the targets configured and surface the scrape failure in metadata; do not use credentials or private API access unless an approved public/API path is provided later.

## Role Filtering

The list should include Product, Design, and Engineering roles. It should not drift into sales, HR, finance, recruiting, general operations, or back-office jobs.

Examples to include:

- Product Manager
- Technical Product Manager
- Technical Program Manager
- Mission Manager
- Mission Lead
- Solutions Architect
- Product Designer
- Brand Designer
- Design Engineer
- Software Engineer
- Platform Engineer
- Developer
- Engineering Manager

The filter should be broad enough for defense-tech naming, but conservative around titles like Account Executive, Recruiter, Controller, Proposal Manager, and Sales Engineer.

## Data Model

`public/jobs.json`:

```json
{
  "generatedAt": "2026-06-03T00:00:00.000Z",
  "sourceNotes": [
    "Jobs are collected from public job boards only."
  ],
  "jobs": [
    {
      "id": "rise8-greenhouse-4340607007",
      "title": "Software Engineer III",
      "location": "Remote",
      "company": "Rise8",
      "discipline": "Engineering",
      "department": "Engineering",
      "applyUrl": "https://job-boards.greenhouse.io/rise8/jobs/4340607007",
      "sourceUrl": "https://job-boards.greenhouse.io/rise8",
      "sourceSystem": "Greenhouse",
      "lastSeenAt": "2026-06-03T00:00:00.000Z"
    }
  ]
}
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

Optional job fields:

- `discipline`: `Product`, `Design`, or `Engineering`
- `department`

## UI Requirements

- Title: `Shane's Job List`
- Hero carousel using committed image assets
- Prominent unofficial disclaimer near the top
- Last updated timestamp from `jobs.json`
- One visible text filter
- Job count
- Job list showing title, location, company, discipline, department when available, and apply link
- Footer with Shane's profile image, LinkedIn, and email

Apply links must use:

```html
target="_blank" rel="noopener noreferrer"
```

## Accessibility

- Semantic HTML
- Search input has a visible label
- Apply links have descriptive accessible names
- Carousel controls are keyboard accessible
- Carousel controls have labels such as `Previous slide` and `Next slide`
- Profile image alt text: `Portrait of Shane Quinlan`
- Sufficient color contrast
- Reduced-motion users should not receive auto-advancing carousel motion

## Acceptance Criteria

1. `npm run build` produces a static build.
2. `npm test` passes.
3. `npm run test:e2e` passes.
4. `npm run jobs:validate` validates `public/jobs.json`.
5. Homepage title is `Shane's Job List`.
6. Disclaimer is visible near the top.
7. A user can filter by role, location, company, or discipline.
8. Job cards show company and product-trio discipline.
9. Apply links are source ATS links and open safely in a new tab.
10. The scraper reads configured public Greenhouse, Ashby, and Rippling boards.
11. Getro/8VC failures are visible in metadata when unauthenticated fetches are blocked.
12. No secrets, credentials, login, database, analytics, or applicant data collection are introduced.
