# API

Shane's Job List publishes static JSON files for the site and for simple external reads. There is no server API.

## Files

```text
public/jobs.json
public/api/jobs.json
public/api/metadata.json
```

## `public/jobs.json`

Used by the browser app.

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

Required fields:

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

## `public/api/jobs.json`

Includes the same jobs plus source metadata and a `version` field.

## `public/api/metadata.json`

Includes scrape status for each configured source.

```json
{
  "generatedAt": "2026-06-03T00:00:00.000Z",
  "sources": [
    {
      "name": "Rise8",
      "system": "Greenhouse",
      "url": "https://job-boards.greenhouse.io/rise8",
      "status": "success",
      "scrapedCount": 16,
      "jobCount": 13
    }
  ],
  "totalJobs": 42,
  "warnings": [],
  "scrapeMethod": "public-board-fetch"
}
```

## Validation

```bash
npm run jobs:validate
```

Validation checks required fields, HTTPS apply URLs, ISO timestamps, optional discipline values, and duplicate IDs.
