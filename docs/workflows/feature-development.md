---
name: GitHub Issue to Merged Feature
version: 1.0.0
description: End-to-end workflow for implementing each Shane's Job List feature from GitHub issue through merge and next-task selection.
tags: [github-issues, development, tests, docs, pull-request]
exported: 2026-05-15T00:00:00Z
---

# Workflow: GitHub Issue to Merged Feature

See `WORKFLOW.md` in the project root for the workspace manifest.

## Conventions

- `actor: human` — must be performed by Shane or another person.
- `actor: agent` — can be delegated to an AI coding agent.
- `actor: either` — human or agent may perform it.
- `enforcement: required` — must be completed before proceeding.
- `enforcement: recommended` — skip only with documented justification.
- Outputs from one step become required inputs for later steps.

---

## Steps

```yaml
workflow:
  id: feature-development
  name: GitHub Issue to Merged Feature
  steps:
    - id: select-issue
      name: Select GitHub Issue
      description: Choose the next open issue in sequence unless priority has been manually changed.
      inputs:
        - "GitHub issue backlog"
        - "Current main branch"
      outputs:
        - "Selected issue URL"
        - "Issue acceptance criteria"
      actor: either
      enforcement: required

    - id: inspect-repo-context
      name: Inspect Repository Context
      description: Read relevant docs, source files, tests, and installed skills before changing code.
      inputs:
        - "Selected issue URL"
        - "PRD.md"
        - "DESIGN.md"
        - "WORKFLOW.md"
      outputs:
        - "Implementation notes"
        - "Applicable skills list"
      actor: agent
      enforcement: required
      ai:
        - name: Coding agent
          skills:
            - accelint-design-foundation
            - accelint-react-best-practices
            - accelint-ts-best-practices
            - accelint-security-best-practices

    - id: create-branch
      name: Create Local Branch
      description: Create a focused branch from updated main.
      inputs:
        - "Selected issue URL"
        - "Updated main branch"
      outputs:
        - "Feature branch"
      actor: either
      enforcement: required

    - id: implement-change
      name: Implement Feature or Fix
      description: Make the smallest coherent code change that satisfies the issue.
      inputs:
        - "Issue acceptance criteria"
        - "Implementation notes"
        - "Feature branch"
      outputs:
        - "Code changes"
        - "Updated job data or fixtures if relevant"
      actor: agent
      enforcement: required

    - id: update-tests
      name: Update Tests
      description: Add or update unit, validation, and e2e tests for changed behavior.
      inputs:
        - "Code changes"
        - "Issue acceptance criteria"
      outputs:
        - "Unit tests"
        - "Validation tests"
        - "E2E tests when UI behavior changes"
      actor: agent
      enforcement: required
      ai:
        - name: Coding agent
          skills:
            - accelint-react-testing
            - accelint-ts-testing
            - accelint-ac-to-playwright

    - id: verify-design-intent
      name: Verify Design Intent for Human Review
      description: Compare implementation against DESIGN.md and capture review notes, including screenshots for UI changes.
      inputs:
        - "Code changes"
        - "DESIGN.md"
        - "Rendered app"
      outputs:
        - "Design review notes"
        - "Screenshots if UI changed"
      actor: agent
      enforcement: required

    - id: update-docs
      name: Update In-App and Repo Docs
      description: Update PRD, DESIGN, README, inline docs, or in-app docs when behavior or constraints change.
      inputs:
        - "Code changes"
        - "Issue acceptance criteria"
        - "Design review notes"
      outputs:
        - "Updated PRD/DESIGN/README/docs as needed"
      actor: agent
      enforcement: required
      ai:
        - name: Coding agent
          skills:
            - accelint-ts-documentation
            - accelint-readme-writer

    - id: run-build-and-tests
      name: Run Build and Tests
      description: Run validation, unit tests, e2e tests, and production build.
      inputs:
        - "Code changes"
        - "Updated tests"
        - "Updated docs"
      outputs:
        - "Command transcript"
        - "Pass/fail summary"
      actor: either
      enforcement: required
      tools:
        - name: npm
          required: true
      commands:
        - "npm run jobs:validate"
        - "npm test"
        - "npm run test:e2e"
        - "npm run build"

    - id: human-review-checkpoint
      name: Human Review Checkpoint
      description: Shane reviews design intent, disclaimer visibility, scope, and risk before PR/MR is opened or merged.
      inputs:
        - "Design review notes"
        - "Command transcript"
        - "Screenshots if UI changed"
      outputs:
        - "Human approval or requested changes"
      actor: human
      enforcement: required

    - id: create-pr
      name: Create Pull Request / Merge Request
      description: Open a PR/MR with complete context for review.
      inputs:
        - "Human approval or requested changes"
        - "Command transcript"
        - "Design review notes"
        - "Updated docs"
      outputs:
        - "PR/MR URL"
      actor: either
      enforcement: required
      pr_template:
        summary:
          - "What changed"
          - "Why it changed"
          - "Linked issue"
          - "Screenshots for UI changes"
          - "Tests run"
          - "Docs updated"
          - "Known risks or follow-ups"

    - id: merge-on-github
      name: Merge on GitHub
      description: Merge the PR/MR after checks and review pass.
      inputs:
        - "PR/MR URL"
        - "Passing checks"
        - "Human approval"
      outputs:
        - "Merged PR/MR"
      actor: human
      enforcement: required

    - id: return-local-to-main
      name: Return Local Branch to Main
      description: After merge, switch back to main and pull the latest merged state.
      inputs:
        - "Merged PR/MR"
      outputs:
        - "Updated local main branch"
      actor: either
      enforcement: required
      commands:
        - "git checkout main"
        - "git pull --ff-only"

    - id: select-next-issue
      name: Select Next GitHub Issue
      description: Look at the next open issue and prepare the next work session.
      inputs:
        - "Updated local main branch"
        - "GitHub issue backlog"
      outputs:
        - "Next selected issue URL"
        - "Next issue acceptance criteria"
      actor: either
      enforcement: required
```
