# CLAUDE.md — Lyntris Jobs

## Project summary

Lyntris Jobs is an unofficial side project by Shane Quinlan. It provides a simple static web app for browsing open jobs across legacy Accelint and Vitesse Systems during the Lyntris transition.

This is **not** an official Lyntris, Accelint, Vitesse Systems, HR, Talent, Legal, Marketing, or IT site.

The app should be simple, auditable, and easy to maintain.

## Core product constraints

- Static browser app.
- No login.
- No backend service.
- No hosted database.
- No required environment variables.
- No secrets.
- No applicant data collection.
- No analytics or telemetry unless explicitly requested in a future issue.
- No scraping gated systems with personal credentials.
- Open-source repo under Apache-2.0.

Preferred stack:

- Vite
- React
- TypeScript
- Plain CSS or CSS modules
- Vitest
- Playwright

Avoid Next.js, server-side rendering, route handlers, databases, auth, and heavy UI frameworks unless a later issue explicitly changes the architecture.

## Source-of-truth documents

Before making changes, read:

- `PRD.md`
- `DESIGN.md`
- `WORKFLOW.md`
- `workflows/feature-development.md`
- `GITHUB_ISSUES.md`
- this file

Use `GITHUB_ISSUES.md` as the ordered backlog. Do not skip ahead unless Shane explicitly reprioritizes.

## Workflow

For each issue:

1. Read the issue goal, tasks, and acceptance criteria.
2. Inspect relevant code and docs before editing.
3. Make the smallest coherent change that satisfies the issue.
4. Add or update tests when behavior changes.
5. Update docs when product behavior, architecture, or workflow changes.
6. Run the required checks.
7. Summarize changes, commands run, results, and known gaps.

Expected commands as the project matures:

```bash
npm run jobs:validate
npm test
npm run test:e2e
npm run build
```

If a command is not available yet, either implement it as part of the current issue or clearly explain why it is not available.

## Branch and PR expectations

Use focused branches. Suggested branch naming:

```text
issue-XX-short-description
```

A PR should include:

- linked issue
- what changed
- why it changed
- screenshots for UI changes
- tests run
- docs updated
- known risks or follow-ups

After a PR is merged on GitHub, return the local repo to main:

```bash
git checkout main
git pull --ff-only
```

Then select the next open issue from `GITHUB_ISSUES.md`.

## Data model

The MVP reads jobs from:

```text
public/jobs.json
```

Expected shape:

```json
{
  "generatedAt": "2026-05-15T00:00:00Z",
  "sourceNotes": [
    "Accelint jobs from public Rippling job board.",
    "Vitesse jobs entered from manual export until approved automated source exists."
  ],
  "jobs": [
    {
      "id": "accelint-rippling-example",
      "title": "Example Role",
      "location": "San Diego, CA",
      "legacyCompany": "Accelint",
      "applyUrl": "https://example.com/apply",
      "sourceUrl": "https://example.com/jobs",
      "sourceSystem": "Rippling",
      "lastSeenAt": "2026-05-15T00:00:00Z"
    }
  ]
}
```

Required job fields:

- `id`
- `title`
- `location`
- `legacyCompany`
- `applyUrl`
- `sourceUrl`
- `sourceSystem`
- `lastSeenAt`

`legacyCompany` must be one of:

- `Accelint`
- `Vitesse`

Do not add UI fields beyond the PRD/DESIGN requirements unless a future issue asks for them.

## Job source rules

### Accelint

Accelint jobs may be sourced from the public Rippling job board:

```text
https://ats.rippling.com/accelintjobboardtest/jobs
```

A future ingestion script may fetch and parse public listings if it requires no secrets and preserves role-specific apply URLs.

### Vitesse

Vitesse jobs are surfaced through ADP, which is gated.

Rules:

- Do not scrape gated ADP pages with personal credentials.
- Do not add browser-based credentialed scraping.
- Use manual JSON/CSV import or an approved export/API path.
- The uploaded ADP/PDF snapshot may be used as a seed source, but it may not include role-specific apply URLs.
- If a Vitesse job lacks a role-specific apply URL, do not fabricate one.

## UI requirements

The MVP UI should include:

- `Lyntris Jobs` title.
- Top-of-page hero carousel using images in `assets/carousel/`.
- Prominent unofficial disclaimer visible early in the page.
- Last updated timestamp from `jobs.json`.
- One text filter across role, location, and legacy company.
- Job count.
- Job list showing:
  - role name
  - location
  - legacy company
  - apply link
- Footer or more-info section identifying Shane Quinlan with:
  - profile image from `assets/profile/shane-profile.png`
  - LinkedIn: `https://www.linkedin.com/in/shane-quinlan-58848363/`
  - email: `shane.quinlan@hypergiant.com`

The footer must not be the only place where the unofficial disclaimer appears.

## Visual direction

The app should look Lyntris-adjacent without implying official brand ownership.

Use:

- dark technical/aerospace visual style
- high contrast
- restrained accent color
- simple cards or table
- accessible typography
- visible keyboard focus states

Do not use protected brand assets unless explicitly provided and approved.

## Asset locations

Hero carousel images:

```text
assets/carousel/carousel-01-tank.png
assets/carousel/carousel-02-controller.png
assets/carousel/carousel-03-fighter.png
```

Shane profile image:

```text
assets/profile/shane-profile.png
```

If the app requires public static asset access, copy or reference these assets according to the Vite project structure while preserving the source assets in the repo.

## Accessibility requirements

- Semantic HTML.
- Search input has a visible label.
- Apply links have clear accessible names, such as `Apply for Senior Systems Engineer`.
- Carousel controls must be keyboard accessible.
- Carousel controls must have labels such as `Previous slide` and `Next slide`.
- Profile image should have descriptive alt text, such as `Portrait of Shane Quinlan`.
- Use sufficient color contrast.
- Do not rely on color alone to convey state.

## Testing expectations

Use tests where they provide useful coverage without adding complexity.

Expected coverage:

- job data validation
- filter behavior
- loading, empty, and error states
- disclaimer visibility
- apply link attributes
- carousel rendering and controls
- footer/profile/contact links

Use Vitest for unit tests and Playwright for browser smoke tests.

## Security and privacy

Do not collect user data.

Do not add:

- cookies
- tracking pixels
- analytics
- telemetry
- login
- applicant forms
- resume upload
- API keys
- secrets
- environment-variable-dependent behavior

External apply links should open directly to the source ATS page in a new tab with:

```html
target="_blank" rel="noopener noreferrer"
```

## Coding style

- Prefer small, explicit TypeScript types.
- Keep components simple.
- Keep state loc