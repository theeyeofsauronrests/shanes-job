# Scraping

The scraper refreshes Shane's Job List from public job boards. It does not use credentials, secrets, private APIs, applicant data, or gated ATS access.

## Command

```bash
npm run scrape
npm run jobs:validate
```

The command writes:

- `public/jobs.json`
- `public/api/jobs.json`
- `public/api/metadata.json`

## Configured Sources

Configured targets live in [scripts/scrape-job-boards.ts](/Users/scrumlord/Documents/beta-lyntris-jobs/scripts/scrape-job-boards.ts).

Current targets:

| Company | ATS | URL |
| --- | --- | --- |
| Lyntris | Rippling | `https://ats.rippling.com/accelintjobboardtest/jobs` |
| 8VC Portfolio | Getro | `https://jobs.8vc.com/jobs?q=design` |
| 8VC Portfolio | Getro | `https://jobs.8vc.com/jobs?q=product` |
| 8VC Portfolio | Getro | `https://jobs.8vc.com/jobs?q=engineer` |
| Rise8 | Greenhouse | `https://job-boards.greenhouse.io/rise8` |
| Second Front Systems | Ashby | `https://jobs.ashbyhq.com/Second-Front-Systems` |
| Defense Unicorns | Greenhouse | `https://job-boards.greenhouse.io/defenseunicorns` |
| Vannevar Labs | Greenhouse | `https://job-boards.greenhouse.io/vannevarlabs` |

## Current Parser Behavior

- Greenhouse: reads public Remix embedded JSON.
- Ashby: reads public `window.__appData`.
- Rippling: reads public Next.js embedded job data.
- Getro: configured as requested, but the 8VC Getro URLs currently return `403` to unauthenticated automated fetches. The scraper records this as a source warning instead of failing the whole refresh.

## Role Filtering

The scraper keeps Product, Design, and Engineering-adjacent jobs. It filters out sales, recruiting, finance, HR, and other back-office roles unless the title matches the intended product-trio scope.

Examples kept:

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

The classifier lives in [src/utils/roleFilter.ts](/Users/scrumlord/Documents/beta-lyntris-jobs/src/utils/roleFilter.ts).

## Safety Rules

- Do not scrape gated ADP pages.
- Do not add browser automation that logs in.
- Do not store credentials, API keys, or secrets.
- Do not fabricate role-specific apply URLs.
- If a public source blocks automated export, keep the failure visible in metadata.

## GitHub Action

`.github/workflows/scrape-jobs.yml` runs the scraper manually via `workflow_dispatch`.

The action:

1. Installs dependencies.
2. Installs Chromium for any future Playwright-backed source.
3. Runs `npm run scrape`.
4. Runs `npm run jobs:validate`.
5. Commits changes to `public/jobs.json` and `public/api/` when job data changes.
