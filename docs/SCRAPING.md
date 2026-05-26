# Job Scraping Documentation

## Overview

The Lyntris Jobs project includes automated scrapers for both Accelint and Vitesse job boards. The scrapers run on-demand (not scheduled) and use **free, DOM-based extraction** - no API costs.

## Architecture

### Accelint (Rippling)
- **Source**: `https://ats.rippling.com/accelintjobboardtest/jobs`
- **Method**: Playwright headless browser + DOM scraping
- **How it works**:
  1. Launches Chromium headless browser
  2. Navigates to Rippling job board
  3. Waits for JavaScript to render job listings
  4. Extracts job data from DOM (titles, IDs, apply URLs)
  5. Saves to `data/accelint-scraped.json`

### Vitesse (ADP)
- **Source**: `https://vitessesys.com/careers/#open-positions`
- **Method**: ADP Workforce Now API interception
- **How it works**:
  1. Launches Chromium headless browser
  2. Navigates to Vitesse careers page
  3. Intercepts the ADP API call that loads jobs
  4. Parses ADP JSON response (titles, locations, requisition IDs)
  5. Saves to `data/vitesse-scraped.json`

### Output Generation
After scraping both sources, the merge script:
1. Combines jobs from both sources
2. Generates `public/jobs.json` (for static site)
3. Generates `api/jobs.json` (for external API consumers)
4. Generates `api/metadata.json` (scrape status + source info)

## Running Locally

### Prerequisites
- Node.js 20+
- npm dependencies installed (`npm install`)
- Playwright browsers installed (automatic on first run)

### Commands

**Scrape everything (Accelint + Vitesse):**
```bash
npm run scrape
```

**Scrape individual sources:**
```bash
npm run scrape:accelint   # Accelint only
npm run scrape:vitesse    # Vitesse only
```

**Validate output:**
```bash
npm run jobs:validate
```

### Expected Output

```
═══════════════════════════════════════════════════
🚀 Lyntris Jobs - Automated Scraper
═══════════════════════════════════════════════════

📍 [1/2] Scraping Accelint from Rippling...
✅ Accelint: 20 jobs

📍 [2/2] Scraping Vitesse from ADP...
✅ Vitesse: 6 jobs

═══════════════════════════════════════════════════
📊 Scraping Summary
═══════════════════════════════════════════════════
Accelint (Rippling): 20 jobs
Vitesse (ADP):       6 jobs
Total:               26 jobs

💾 Saved: public/jobs.json
💾 Saved: api/jobs.json
💾 Saved: api/metadata.json

✅ All done! Run `npm run dev` to see the updated jobs.
```

## Running via GitHub Actions

### Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select **"Scrape Job Listings"** workflow
3. Click **"Run workflow"** button
4. Wait ~2 minutes for scraping to complete
5. Workflow auto-commits updated JSON files to `main`
6. Vercel auto-deploys the updated site

### Workflow Summary

The GitHub Actions workflow:
- ✅ Runs on Ubuntu with Node.js 20
- ✅ Installs dependencies + Playwright
- ✅ Runs full scraper (`npm run scrape`)
- ✅ Validates output (`npm run jobs:validate`)
- ✅ Commits changes (if any) to `main`
- ✅ Generates summary report in Actions UI

**No secrets required** - both job boards are publicly accessible.

## Cost Analysis

| Component | Cost |
|-----------|------|
| Playwright (headless browser) | Free (local or GitHub Actions) |
| GitHub Actions minutes | Free tier (2000 min/month) |
| Rippling scraping | Free (public board) |
| ADP API interception | Free (public endpoint) |
| **Total monthly cost** | **$0.00** |

Expected runtime per scrape: **1-2 minutes**

## Troubleshooting

### Scraper hangs or times out

**Rippling timeout:**
- Rippling site can be slow to load (30+ seconds)
- Increase timeout in `scripts/scrape-rippling.ts` if needed
- Check if Rippling is down: https://status.rippling.com

**Vitesse timeout:**
- ADP API call should complete in < 10 seconds
- Check if Vitesse site structure changed
- Verify ADP widget still exists on careers page

### Zero jobs found

**Accelint:**
- Verify Rippling job board URL is still valid
- Check if HTML structure changed (inspect selectors)
- Look for Rippling maintenance windows

**Vitesse:**
- Verify ADP API endpoint is still being called
- Check raw API output: `data/vitesse-raw-api.json`
- Confirm Vitesse still uses ADP (not a new ATS)

### Missing job fields

**Locations not extracted:**
- Accelint: Rippling DOM doesn't always include location
- Vitesse: Falls back to "Location not specified" if ADP data incomplete
- This is non-blocking - jobs still display without locations

**Apply URLs wrong:**
- Accelint: Check if Rippling changed URL structure
- Vitesse: ADP sometimes omits apply links (falls back to careers page)

### SSL certificate errors (local only)

If you see `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`:
- This is a local development issue only
- GitHub Actions won't have this problem
- Workaround: use Playwright's page interception (already implemented)

## Data Schema

### Intermediate Files (gitignored)

**`data/accelint-scraped.json`:**
```json
{
  "generatedAt": "2026-05-26T12:00:00.000Z",
  "source": "Rippling",
  "sourceUrl": "https://ats.rippling.com/accelintjobboardtest/jobs",
  "jobCount": 20,
  "jobs": [...]
}
```

**`data/vitesse-scraped.json`:**
```json
{
  "generatedAt": "2026-05-26T12:00:00.000Z",
  "source": "ADP Workforce Now API",
  "sourceUrl": "https://vitessesys.com/careers/",
  "jobCount": 6,
  "jobs": [...]
}
```

### Final Outputs (committed)

**`public/jobs.json`** (consumed by static site):
```json
{
  "generatedAt": "2026-05-26T12:00:00.000Z",
  "sourceNotes": [
    "Accelint: 20 jobs scraped from Rippling",
    "Vitesse: 6 jobs scraped from ADP",
    "Automated via on-demand scraper script"
  ],
  "jobs": [...]
}
```

**`api/jobs.json`** (for external consumers):
```json
{
  "version": "1.0",
  "generatedAt": "2026-05-26T12:00:00.000Z",
  "sources": [
    {
      "name": "Accelint",
      "system": "Rippling",
      "method": "DOM Scraping",
      "lastScraped": "2026-05-26T12:00:00.000Z",
      "jobCount": 20,
      "status": "success"
    },
    {
      "name": "Vitesse",
      "system": "ADP",
      "method": "API Interception",
      "lastScraped": "2026-05-26T12:00:00.000Z",
      "jobCount": 6,
      "status": "success"
    }
  ],
  "totalJobs": 26,
  "jobs": [...],
  "accessUrl": "https://beta-lyntris-jobs.vercel.app/api/jobs.json",
  "cors": "enabled"
}
```

**`api/metadata.json`** (monitoring):
```json
{
  "lastSuccessfulScrape": "2026-05-26T12:00:00.000Z",
  "sources": [...],
  "totalJobs": 26,
  "warnings": [],
  "scrapeMethod": "on-demand"
}
```

## Maintenance

### When to re-scrape

Run the scraper when:
- ✅ You notice jobs are outdated on the site
- ✅ Weekly on Monday mornings (recommended)
- ✅ When you hear about new job postings
- ✅ After Rippling or ADP site changes

### Monitoring scrape quality

Check these indicators after each scrape:
- Job count shouldn't drop dramatically (> 50%)
- All jobs should have titles
- Most jobs should have locations
- All apply URLs should be valid HTTPS

### Updating scrapers

If job boards change:

**Rippling:**
1. Check `rippling-page.html` (saved during scrape)
2. Update selectors in `scripts/scrape-rippling.ts`
3. Test locally before committing

**Vitesse:**
1. Check `data/vitesse-raw-api.json` (saved during scrape)
2. Update field mappings in `scripts/scrape-vitesse.ts`
3. Test locally before committing

## Future Enhancements

Potential improvements (not implemented yet):
- [ ] Scheduled daily scrapes (cron-based)
- [ ] Email/Slack notifications on failures
- [ ] Historical job tracking (store snapshots)
- [ ] Diff reports (jobs added/removed since last scrape)
- [ ] Rippling location extraction improvements
- [ ] Vitesse apply URL extraction from ADP
