# DESIGN.md — Lyntris Jobs Side Project

## Project name

**Lyntris Jobs**

Working repo name: `lyntris-jobs`

## Project status and disclaimer

This is an unofficial side project created by **Shane Quinlan** to make open roles across legacy Accelint and Vitesse easier to browse during the Lyntris transition.

This is **not** an official Lyntris, Accelint, Vitesse Systems, or corporate recruiting site. It should not imply endorsement, ownership, or operational support by HR, Talent, Legal, Marketing, or IT unless that approval is explicitly obtained later.

Recommended persistent disclaimer copy:

> Unofficial side project by Shane Quinlan. This site is not an official Lyntris, Accelint, or Vitesse Systems recruiting site. Job details and application links are sourced from the companies' public career pages and applicant tracking systems. Always rely on the linked application page as the source of truth.

The GitHub repository should be public under the **Apache License 2.0**.

## Goals

- Provide a dead-simple browser-only jobs board for the Lyntris transition period.
- Show one combined list of open roles from legacy Accelint and Vitesse Systems.
- Keep the data model small: role name, location, legacy company, apply URL, source URL, last checked timestamp.
- Let users filter against the visible fields with one simple text input.
- Avoid login, backend services, hosted databases, secret management, and complicated deployment.
- Make the site easy to audit, fork, and maintain.

## Non-goals

- No applicant workflow, referrals, accounts, saved jobs, notifications, or analytics in MVP.
- No attempt to bypass gated ATS controls.
- No storage of applicant data.
- No official brand claims or official recruiting authority.
- No server-side database in MVP.
- No complex categorization, inferred tagging, job matching, or AI summaries.

## Source findings as of 2026-05-15

### Accelint

- Public career page: `https://www.accelint.com/careers`
- Public ATS job board: `https://ats.rippling.com/accelintjobboardtest/jobs`
- Rippling exposes a public job list and role-specific public job URLs, e.g. `/jobs/<uuid>`.
- The public list includes role names, locations, and job-specific links.

### Vitesse Systems

- Public career page: `https://vitessesys.com/careers/#open-positions`
- The public page includes an “Explore Our Open Positions” section but the fetched HTML does not expose a useful structured list of open roles.
- The ATS is described as ADP and gated. The app should not attempt credentialed scraping from the browser.
- MVP should support Vitesse jobs through manual JSON/CSV import or a local authorized-export script until a stable public feed, ADP report export, or approved API path exists.

## Recommended architecture

### MVP architecture: static app + committed JSON

Use a static single-page app that reads `public/jobs.json`.

```text
Browser
  -> static assets from GitHub Pages / Netlify / Vercel
  -> fetch('/jobs.json')
  -> render and filter in memory
  -> apply links go directly to source ATS pages
```

This keeps the MVP boring and reliable. It avoids CORS problems, ATS terms-of-use risk, and browser scraping fragility.

### Data refresh model

Phase 1 should use a simple manually maintained `jobs.json` file.

Phase 2 can add a local or CI-assisted ingestion script:

```text
npm run jobs:fetch:accelint
npm run jobs:import:vitesse -- ./exports/vitesse.csv
npm run jobs:validate
npm run jobs:write
```

If GitHub Actions are used later, the action should not require secrets for Accelint public scraping. Vitesse automation should only be added if there is an approved public feed or non-interactive export that does not require personal credentials.

### Why not DuckDB WASM for MVP?

DuckDB WASM is useful when the browser needs local analytical querying over large or tabular datasets. This project probably has fewer than a few hundred rows. Plain JSON plus JavaScript filtering is simpler, faster to ship, easier to audit, and has fewer moving pieces.

DuckDB WASM can remain a design option for a later experiment if the site grows into a richer searchable archive, but it should not be part of the MVP acceptance criteria.

## Data model

`public/jobs.json`:

```json
{
  "generatedAt": "2026-05-15T00:00:00Z",
  "sourceNotes": [
    "Accelint jobs from public Rippling job board.",
    "Vitesse jobs entered from manual export until approved automated source exists."
  ],
  "jobs": [
    {
      "id": "accelint-rippling-5d2a7242-56b5-4199-9e23-15f39a42748c",
      "title": "DevOps / Platform Engineer (Level II) (FSI)",
      "location": "San Diego, CA",
      "legacyCompany": "Accelint",
      "applyUrl": "https://ats.rippling.com/accelintjobboardtest/jobs/5d2a7242-56b5-4199-9e23-15f39a42748c",
      "sourceUrl": "https://ats.rippling.com/accelintjobboardtest/jobs",
      "sourceSystem": "Rippling",
      "lastSeenAt": "2026-05-15T00:00:00Z"
    }
  ]
}
```

Required fields:

- `id`
- `title`
- `location`
- `legacyCompany`: `Accelint` or `Vitesse`
- `applyUrl`
- `sourceUrl`
- `sourceSystem`
- `lastSeenAt`

Optional fields for later:

- `department`
- `employmentType`
- `payRange`
- `remoteStatus`
- `isContingent`

Do not add optional fields to the UI until there is a clear need.

## Frontend stack

Recommended default:

- Vite
- React
- TypeScript
- Plain CSS or CSS modules
- Vitest
- Playwright for one smoke/e2e test

Avoid introducing Next.js unless there is a clear need for server rendering or route handlers. A static Vite app matches the “dead-simple” constraint better.

## UI requirements

### Layout

### Hero carousel

- Add a simple carousel at the top of the page using the provided assets:
  - `assets/carousel/carousel-01-tank.png`
  - `assets/carousel/carousel-02-controller.png`
  - `assets/carousel/carousel-03-fighter.png`
- The carousel can auto-advance slowly and should also support manual previous/next controls.
- Use the images as a branded visual treatment, not as navigational content.
- Keep implementation simple: one active slide, light controls, no heavy dependencies required.
- The unofficial disclaimer should remain clear and should not be visually overshadowed by the carousel.
- On mobile, preserve image legibility with responsive cropping rather than shrinking the carousel to an unusable height.

### Footer

- Add a small footer or “more info” section that identifies the maintainer.
- Footer content should include:
  - `Created by Shane Quinlan`
  - A profile image using `assets/profile/shane-profile.png`
  - LinkedIn: `https://www.linkedin.com/in/shane-quinlan-58848363/`
  - Email: `shane.quinlan@hypergiant.com`
- The profile image should be displayed as a small avatar/headshot, not a large hero image.
- Footer should reinforce that the site is unofficial and open-source, but it should not be the only place where the disclaimer appears.

- Header with `Lyntris Jobs` wordmark-style text.
- Top-of-page hero carousel using the provided three images in `assets/carousel/`.
- Prominent unofficial disclaimer near the top and still visible in the first viewport, even with the carousel present.
- Small source freshness line: `Last updated: <timestamp>`.
- Single search input: placeholder `Filter by role, location, or company`.
- Job count: `Showing X of Y roles`.
- Job table/list with:
  - Role name
  - Location
  - Legacy company
  - Apply link

### Filtering

- One case-insensitive text filter.
- Filter should match `title`, `location`, and `legacyCompany`.
- No advanced filters in MVP.
- If no jobs match, show a clear empty state.

### Apply behavior

- Apply links open the source ATS job detail page in a new tab.
- The app never collects applicant data.
- The source ATS page is the source of truth.

## Lyntris-inspired visual direction

Because this is unofficial, the design should feel adjacent to Lyntris without copying restricted brand assets unless they are explicitly approved.

Recommended direction:

- Clean, technical, aerospace/defense-adjacent presentation.
- Dark navy or near-black background.
- Bright accent color used sparingly for links and focus states.
- High contrast and accessible typography.
- Simple cards/table; no heavy animation.
- Unofficial disclaimer should be visually prominent, not buried in the footer.

Suggested tokens:

```css
:root {
  --bg: #07111f;
  --panel: #0e1b2d;
  --text: #f5f7fb;
  --muted: #a9b4c4;
  --line: #24344d;
  --accent: #62d6ff;
  --warning-bg: #2b2108;
  --warning-border: #e7b84d;
}
```

## Accessibility

- Minimum AA contrast.
- Visible focus states.
- Semantic HTML: `main`, `header`, `table` or list landmarks.
- Search input has a visible label.
- Carousel controls are keyboard accessible and have clear labels like `Previous slide` and `Next slide`.
- Carousel images include meaningful alt text or are treated as decorative if the surrounding heading/disclaimer already conveys purpose.
- Shane profile image includes descriptive alt text such as `Portrait of Shane Quinlan`.
- Apply links have clear accessible names, e.g. `Apply for Senior Systems Engineer`.

## Error handling

- If `jobs.json` fails to load, show a user-friendly error.
- If `jobs` is empty, show a non-alarming empty state.
- If any job lacks an apply URL, do not render a broken link; show `Apply link unavailable` and fail validation in tests.

## Validation rules

Add a script such as `scripts/validate-jobs.ts` that fails the build if:

- `jobs.json` is invalid JSON.
- Required fields are missing.
- `legacyCompany` is not `Accelint` or `Vitesse`.
- `applyUrl` is not an absolute `https://` URL.
- Duplicate IDs exist.
- Any title or location is empty.

## Relevant agent skills

Install relevant skills from `gohypergiant/agent-skills` at project scope and instruct coding agents to evaluate applicable skills before implementation.

Recommended skills for this project:

- `accelint-design-foundation` — use for visual design and UI consistency guidance.
- `accelint-react-best-practices` — use for component structure and React implementation.
- `accelint-react-testing` — use for component tests.
- `accelint-ts-best-practices` — use for TypeScript types and strictness.
- `accelint-ts-testing` — use for utility and validation tests.
- `accelint-security-best-practices` — use for safe external links, data handling, and scraping boundaries.
- `accelint-ts-documentation` — use when updating PRD/design/docs from implementation changes.
- `accelint-readme-writer` — use when drafting the repo README.
- `accelint-ac-to-playwright` — use when converting acceptance criteria into Playwright checks.

Suggested install command:

```bash
npx skills add gohypergiant/agent-skills
```

When prompting agents:

> Before relying on training data, evaluate and apply all applicable project skills. Use the skills installed in this repo for React, TypeScript, testing, security, documentation, and design guidance.

## Open questions

1. What exact public name should be used: `Lyntris Jobs`, `Unofficial Lyntris Jobs`, or another name?
2. Is use of the Lyntris name acceptable for an unofficial side project if the disclaimer is prominent?
3. Can HR/Talent provide an approved Vitesse export or feed?
4. Should Accelint jobs be fetched automatically, or should both sources start as manual JSON for symmetry and safety?
5. Where should it be hosted: GitHub Pages, Netlify, Vercel, or another static host?
