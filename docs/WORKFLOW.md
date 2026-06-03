---
name: Shane's Job List
version: 2.0.0
team: Shane Quinlan / Unofficial Side Project
exported: 2026-06-03T00:00:00Z
---

# Workflow Manifest: Shane's Job List

## Load Instructions

This file is the workspace index. When starting work, read this manifest and load only the workflow files relevant to the task.

```yaml
workspace:
  name: Shane's Job List
  version: 2.0.0
  workflows:
    - id: feature-development
      name: GitHub Issue to Merged Feature
      file: workflows/feature-development.md
      description: End-to-end issue-driven implementation workflow for the site.
      tags: [github-issues, development, tests, docs, pull-request]
      tokens: 1800
```

## Repository Conventions

- Keep the app static and simple.
- Do not add secrets, login, hosted databases, analytics, telemetry, or gated scraping.
- Keep Product, Design, and Engineering role filtering explicit and tested.
- Update product, design, scraping, and API docs when behavior changes.
- Make the unofficial status visible in the app and docs.

## Done Means

- Acceptance criteria are addressed.
- Tests are added or updated where behavior changed.
- `npm run jobs:validate`, `npm test`, `npm run test:e2e`, and `npm run build` pass or failures are explained.
- Docs are updated.
- Known scrape gaps, especially Getro/8VC access, are called out.
