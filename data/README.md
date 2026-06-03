# Manual Job Import

This directory contains CSV files for manual job imports.

Manual import is a fallback for corrections, one-off additions, or sources that provide an approved export but no public board. The app must not use personal credentials or scrape gated systems.

## CSV Format

Required columns:

```csv
title,location,company,applyUrl,sourceSystem
```

Optional columns:

```csv
department,discipline
```

`discipline` may be `Product`, `Design`, or `Engineering`. If it is omitted, the import script infers it from the title and department.

## Example

```csv
title,location,company,applyUrl,sourceSystem,department,discipline
"Software Engineer","Remote",Rise8,https://job-boards.greenhouse.io/rise8/jobs/example,Greenhouse,Engineering,Engineering
"Product Designer","Remote, United States",Defense Unicorns,https://job-boards.greenhouse.io/defenseunicorns/jobs/example,Greenhouse,R&D,Design
```

## Import

```bash
npm run jobs:import
npm run jobs:validate
```

Each import replaces `public/jobs.json`, so keep the CSV as the complete list you want to publish.

## Rules

- Use public or approved exported job data only.
- Do not add credentials, secrets, or gated scraping.
- `applyUrl` must be a role-specific HTTPS application URL.
- Keep the list focused on Product, Design, and Engineering-adjacent roles.
