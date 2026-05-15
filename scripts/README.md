# Job Ingestion Scripts

This directory contains scripts for fetching and updating job listings from various sources.

## Accelint Ingestion

### Usage

```bash
npm run jobs:fetch:accelint
```

This script:
1. Fetches the public Accelint job board from Rippling
2. Parses HTML to extract job details
3. Merges with existing `public/jobs.json`
4. Preserves non-Accelint jobs (e.g., Vitesse manual entries)

### Source

- **URL**: `https://ats.rippling.com/accelintjobboardtest/jobs`
- **Source System**: Rippling (public job board)
- **No secrets required**: This is a public-facing job board

### Output Format

Each Accelint job is converted to:

```json
{
  "id": "accelint-rippling-{uuid}",
  "title": "Job Title",
  "location": "Location",
  "legacyCompany": "Accelint",
  "applyUrl": "https://ats.rippling.com/accelintjobboardtest/jobs/{uuid}",
  "sourceUrl": "https://ats.rippling.com/accelintjobboardtest/jobs",
  "sourceSystem": "Rippling",
  "lastSeenAt": "2026-05-15T..."
}
```

### Limitations

- **HTML parsing**: If Rippling changes their HTML structure, the parser may break
- **No applicant data**: This script only reads public job listings, never touches applicant data
- **Manual fallback**: If the script fails, jobs can be manually added to `public/jobs.json`

### Testing

```bash
npm test -- scripts/ingest-accelint.test.ts
```

Tests use HTML fixtures in `scripts/fixtures/` and do not require network access.

## Vitesse Ingestion

Currently, Vitesse jobs are entered manually until an approved automated source exists.

Manual import process:
1. Export job data from approved source
2. Format as JSON matching the schema
3. Manually merge into `public/jobs.json`

See Issue #10 for planned Vitesse manual import path.
