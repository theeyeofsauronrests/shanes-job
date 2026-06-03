# Shane's Job List

An unofficial static jobs page maintained by Shane Quinlan. It focuses on Product, Design, and Engineering roles across technology companies.

**This site is not affiliated with, endorsed by, or officially connected to any of the companies listed here.** Job details and application links are sourced from public career pages. This site does not represent the views, policies, or hiring practices of any listed company. The linked application page is always the authoritative source of truth.

## What It Does

- Loads job data from `public/jobs.json`
- Filters roles by title, location, company, and discipline
- Shows role-specific apply links in a new tab
- Keeps the site static: no login, backend, database, tracking, cookies, or applicant data collection
- Scrapes only public job boards in local/CI scripts

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Commands

```bash
npm run dev            # Start Vite
npm run build          # Typecheck and build static files
npm test               # Run unit tests
npm run test:e2e       # Run Playwright smoke tests
npm run jobs:validate  # Validate public/jobs.json
npm run jobs:import    # Import manual CSV data
npm run scrape         # Refresh jobs from configured public boards
```

## Job Data

The app reads:

```text
public/jobs.json
```

Each job has:

```json
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
```

`discipline` is optional but, when present, must be `Product`, `Design`, or `Engineering`.

## Scraping

Configured sources live in `scripts/scrape-job-boards.ts`.

Current source types:

- Accelint public Rippling board
- Greenhouse boards for Rise8, Defense Unicorns, and Vannevar Labs
- Ashby board for Second Front Systems
- 8VC Getro URLs are configured, but Getro currently returns `403` to unauthenticated automated fetches

Run:

```bash
npm run scrape
npm run jobs:validate
```

The scraper filters out sales, recruiting, finance, HR, and other back-office roles unless the title matches the product-trio intent, such as `Mission Manager`, `Solutions Architect`, `Product Manager`, `Product Designer`, `Developer`, or `Engineer`.

## Manual Import

Manual CSV import is still available for approved exports or corrections:

```bash
npm run jobs:import
```

See `data/README.md`.

## Project Structure

```text
src/
  components/        React UI
  types/             Shared job types
  utils/             Role filtering logic
scripts/
  scrape-job-boards.ts
  scrape-all.ts
  import-jobs.ts
  validate-jobs.ts
public/
  jobs.json
  api/
data/
  jobs.csv
docs/
```

## Privacy And Security

- No applicant forms
- No resume upload
- No cookies, analytics, telemetry, or tracking pixels
- No required environment variables
- No secrets
- No credentialed scraping

## License

Apache-2.0. See `LICENSE`.

## Contact

Shane Quinlan

- [LinkedIn](https://www.linkedin.com/in/shane-quinlan-58848363/)
- <shane.quinlan@hypergiant.com>
