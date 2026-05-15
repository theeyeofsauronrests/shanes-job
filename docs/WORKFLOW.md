---
name: Lyntris Jobs Side Project
version: 1.0.0
team: Shane Quinlan / Unofficial Side Project
exported: 2026-05-15T00:00:00Z
---

# Workflow Manifest: Lyntris Jobs Side Project

## Load Instructions

This file is the workspace index. When starting any work session, read this manifest first. Load only the workflow files relevant to the task. Respect actor boundaries: steps marked `human` require Shane or another person to perform them; agents may prepare artifacts but must not claim the human step is complete.

```yaml
workspace:
  name: Lyntris Jobs Side Project
  version: 1.0.0
  workflows:
    - id: feature-development
      name: GitHub Issue to Merged Feature
      file: workflows/feature-development.md
      description: End-to-end issue-driven implementation workflow for the site.
      tags: [github-issues, development, tests, docs, pull-request]
      tokens: 1800
```

## Workflow Index

- **[GitHub Issue to Merged Feature](workflows/feature-development.md)** — Issue-driven implementation, tests, docs, PR/MR, merge follow-through, and next issue selection.

## Repository conventions

- Treat GitHub issues as the ordered source of work.
- Keep implementation, tests, and docs in the same branch when the behavior changes.
- Keep the app static and simple unless a GitHub issue explicitly changes that constraint.
- Do not add secrets, login, hosted databases, or gated scraping.
- Make the unofficial status visible in product copy and docs.

## Agent skill instructions

Before implementation work, evaluate and apply relevant skills from `gohypergiant/agent-skills`, especially:

- `accelint-design-foundation`
- `accelint-react-best-practices`
- `accelint-react-testing`
- `accelint-ts-best-practices`
- `accelint-ts-testing`
- `accelint-security-best-practices`
- `accelint-ts-documentation`
- `accelint-readme-writer`
- `accelint-ac-to-playwright`

Suggested install:

```bash
npx skills add gohypergiant/agent-skills
```

## Done means

A task is done only when:

- The GitHub issue acceptance criteria are addressed.
- Tests have been added or updated where appropriate.
- Design intent has been verified against `DESIGN.md`.
- Product intent has been verified against `PRD.md`.
- In-app docs and repo docs are updated.
- Build and tests pass locally.
- A PR/MR includes the required summary, test evidence, screenshots where UI changed, and follow-up risks.
- After merge, the local branch is returned to `main` and updated.
- The next GitHub issue is selected.
