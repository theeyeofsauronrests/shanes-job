# Manual Job Import

This directory contains CSV files for manual job imports.

## Purpose

The manual import process allows updating job listings without requiring:
- Automated scraping scripts
- API credentials or secrets
- Access to gated systems (like ADP)

This approach is ideal for:
- **Vitesse jobs** - ADP is gated and scraping with personal credentials is out of scope
- **Accelint jobs** - Rippling uses client-side rendering that's difficult to scrape
- **Any manual updates** - Quick fixes, corrections, or one-off updates

## CSV Format

The CSV file must have the following columns (in this exact order):

```csv
title,location,legacyCompany,applyUrl,sourceSystem
```

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Job title | `"Software Engineer"` |
| `location` | Job location | `"San Diego, CA"` |
| `legacyCompany` | Must be `Accelint` or `Vitesse` | `Accelint` |
| `applyUrl` | HTTPS URL to apply | `https://example.com/apply` |
| `sourceSystem` | Where job came from | `Rippling` or `"ADP (manual export)"` |

### CSV Rules

1. **Header row required** - First row must be the field names
2. **Quotes for commas** - Use quotes around fields containing commas: `"San Diego, CA"`
3. **HTTPS URLs only** - All apply URLs must start with `https://`
4. **Valid companies** - `legacyCompany` must be exactly `Accelint` or `Vitesse`
5. **No empty fields** - All five fields are required for every job

### Example CSV

```csv
title,location,legacyCompany,applyUrl,sourceSystem
"DevOps / Platform Engineer (Level II) (FSI)","San Diego, CA",Accelint,https://ats.rippling.com/accelintjobboardtest/jobs/example-uuid,Rippling
"Senior Software Engineer","Remote (United States)",Accelint,https://ats.rippling.com/accelintjobboardtest/jobs/another-uuid,Rippling
"Systems Engineer","Chantilly, VA",Vitesse,https://vitessesys.com/careers/#open-positions,"ADP (manual export)"
"Project Manager","Chantilly, VA",Vitesse,https://vitessesys.com/careers/#open-positions,"ADP (manual export)"
```

## Import Process

### 1. Update the CSV

Edit `data/jobs.csv` with the current job listings.

**Important**: Each import **replaces all previous jobs**. The CSV should contain the complete current job list, not just new jobs.

### 2. Run the import script

```bash
npm run jobs:import
```

This will:
1. Read and parse `data/jobs.csv`
2. Validate all rows (required fields, correct format)
3. Generate unique IDs for each job
4. Replace `public/jobs.json` with the new data
5. Update the `generatedAt` timestamp

### 3. Verify the import

Check the output for any errors. Successful import shows:

```
✓ Imported 4 jobs to /path/to/public/jobs.json
✓ Generated at: 2026-05-15T18:00:00.000Z
```

### 4. Test locally

```bash
npm run dev
```

Visit http://localhost:5173 and verify:
- All jobs are visible
- Job count is correct
- Filter works across all jobs
- Apply links are correct

### 5. Commit and deploy

```bash
git add data/jobs.csv public/jobs.json
git commit -m "Update job listings from manual import"
git push
```

## Error Handling

The import script will fail with a clear error message if:

- CSV file is missing or empty
- Header row doesn't match required format
- Any required field is empty
- `legacyCompany` is not `Accelint` or `Vitesse`
- `applyUrl` doesn't start with `https://`
- Row has wrong number of columns

**Fix the error in the CSV and run the import again.**

## Important Notes

### Gated Systems

**ADP scraping is out of scope** unless an approved non-credentialed export exists. 

Do not:
- Use personal credentials to scrape ADP
- Add browser automation that logs into gated systems
- Store or commit any credentials

Manual export and CSV import is the approved path.

### Overwrite Behavior

Each import **replaces the entire jobs list**. If you run the import with only 2 jobs in the CSV, the site will show only 2 jobs (previous jobs are removed).

Always ensure the CSV contains the **complete current job list**.

### Generated IDs

The script generates IDs in the format:
- `accelint-manual-{index}-{slugified-title}`
- `vitesse-manual-{index}-{slugified-title}`

These IDs are stable as long as the job order in the CSV doesn't change.

### Import Date

The import date/time is recorded in `jobs.json` as `generatedAt` and displayed on the site as "Last updated".

## Workflow Examples

### Weekly Update

1. Check Accelint Rippling board manually
2. Check Vitesse open positions
3. Update `data/jobs.csv` with complete list
4. Run `npm run jobs:import`
5. Test locally
6. Commit and push

### Quick Fix

1. Edit one job in `data/jobs.csv`
2. Run `npm run jobs:import`
3. Verify change locally
4. Commit and push

### Adding New Jobs

1. Add new rows to bottom of `data/jobs.csv`
2. Ensure all existing jobs remain in the file
3. Run `npm run jobs:import`
4. Verify all jobs (old + new) appear
5. Commit and push
