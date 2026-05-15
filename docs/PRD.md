# PRD.md — Unofficial Lyntris Jobs Board

## Summary

Create a simple, static web app that combines open jobs from legacy Accelint and Vitesse Systems into one unofficial Lyntris-transition job board.

The app is a side project by Shane Quinlan. It must be explicit that it is not an official corporate site.

## Problem

After the Lyntris merger, there is not yet a combined job board. Candidates, employees, and internal advocates need a simple way to see roles across legacy Accelint and Vitesse without bouncing between separate sites and ATS systems.

## Users

Primary users:

- People looking for open roles at the newly combined organization.
- Employees who want to share a simple cross-company jobs page.
- Shane Quinlan as maintainer.

Secondary users:

- Recruiting or HR stakeholders who may later validate or adopt a better source-of-truth approach.

## MVP scope

The MVP is a static browser app with:

- Combined job list.
- Top-of-page image carousel using the provided branded imagery.
- Role name.
- Location.
- Legacy company: `Accelint` or `Vitesse`.
- Apply link to the role-specific application page.
- Simple text filter across role, location, and legacy company.
- Clear unofficial side-project disclaimer.
- Footer or more-info section with Shane contact info (profile image, LinkedIn, and email).
- Open-source Apache-2.0 repo.

## Out of scope

- User login.
- Applicant tracking.
- Resume upload.
- Referral flow.
- Email notifications.
- Hosted database.
- Admin UI.
- Complex tagging or categorization.
- AI-generated job summaries.
- Scraping gated systems with personal credentials.

## Source requirements

### Accelint

Use the public Rippling job board as the source for Accelint roles:

- Source board: `https://ats.rippling.com/accelintjobboardtest/jobs`
- Role links follow job-specific pages under the Rippling board.

### Vitesse

Use the public Vitesse careers page as a discovery source:

- Public page: `https://vitessesys.com/careers/#open-positions`

The Vitesse ATS is gated through ADP. MVP should support manual entry/import for Vitesse jobs until an approved automated source exists.

## Functional requirements

### FR1 — Display jobs

The app must display a list of jobs from `public/jobs.json`.

Each visible job row/card must show:

- Role name
- Location
- Legacy company
- Apply link

### FR2 — Filter jobs

The app must provide one text filter.

The filter must be:

- Case-insensitive.
- Applied against role name, location, and legacy company.
- Fast enough for at least 500 jobs.

### FR3 — Apply link

Each job must link to the role-specific application page.

- Link opens in a new tab.
- Link uses `rel="noopener noreferrer"`.
- The app does not intermediate or track applications.

### FR4 — Hero carousel

The app must display a simple carousel near the top of the page.

- Use the three provided images committed in the repo.
- Carousel may auto-advance and must support manual controls.
- The carousel is visual only and does not need captions in MVP.
- The carousel must not hide or displace the unofficial disclaimer below the fold on standard desktop or mobile layouts.

### FR5 — Unofficial disclaimer

The app must prominently state:

- It is unofficial.
- It is a side project by Shane Quinlan.
- It is not an official Lyntris, Accelint, or Vitesse Systems site.
- Linked application pages are the source of truth.

### FR6 — Source freshness

The app must display the data generation timestamp from `jobs.json`.

### FR7 — Footer with maintainer info

The app must include a footer or more-info section that identifies the maintainer and provides a profile image plus basic contact links.

The footer must include:

- Shane Quinlan name
- Profile image using `assets/profile/shane-profile.png`
- LinkedIn link: `https://www.linkedin.com/in/shane-quinlan-58848363/`
- Email link: `mailto:shane.quinlan@hypergiant.com`

### FR8 — Empty and error states

The app must handle:

- No jobs loaded.
- Jobs file cannot be loaded.
- Filter returns no matches.

## Non-functional requirements

- Static hosting compatible.
- No login.
- No server runtime required.
- No required environment variables.
- No user data collection.
- Accessible keyboard navigation.
- Basic responsive design.
- Build and tests run locally with one command.

## Data requirements

`jobs.json` must include:

- `generatedAt`
- `jobs[]`
- each job has `id`, `title`, `location`, `legacyCompany`, `applyUrl`, `sourceUrl`, `sourceSystem`, `lastSeenAt`

## Acceptance criteria

1. Running `npm install && npm run dev` starts the site locally.
2. Running `npm run build` produces a static build.
3. Running `npm test` executes unit tests.
4. Running `npm run test:e2e` executes at least one browser smoke test.
5. Running `npm run jobs:validate` fails on malformed job data.
6. The homepage loads jobs from `jobs.json`.
7. A user can filter by role, location, or company.
8. Each job has a role-specific apply link.
9. A top-of-page carousel renders the three committed images.
10. The unofficial disclaimer is visible without scrolling on desktop and mobile.
11. The footer or more-info section includes Shane’s profile image, LinkedIn, and email links.
12. No app code requires secrets or login.

## Suggested implementation phases

### Phase 0 — Repo scaffold and docs

- Create Vite React TypeScript app.
- Add Apache-2.0 license.
- Add README, PRD, DESIGN, WORKFLOW.
- Install applicable agent skills.

### Phase 1 — Static data MVP

- Add `public/jobs.json` with sample validated records.
- Implement job list and filter.
- Implement hero carousel with committed image assets.
- Implement disclaimer, footer, and source freshness.
- Add unit tests and e2e smoke test.

### Phase 2 — Accelint ingestion

- Add local script to fetch/parse public Rippling board.
- Preserve role-specific apply URLs.
- Merge into `jobs.json`.
- Add tests with fixture HTML.

### Phase 3 — Vitesse import

- Add manual CSV or JSON import script for Vitesse jobs.
- Document manual export/import steps.
- Validate apply URLs.

### Phase 4 — Optional scheduled refresh

- Add GitHub Action only if it remains simple and does not require personal credentials.
- Do not automate gated ADP access unless an approved source exists.

## Metrics for success

- The site can be built and deployed as static files.
- Updating job data is understandable by a non-specialist maintainer.
- Users can find and click a relevant role within seconds.
- The site does not create confusion about official status.
