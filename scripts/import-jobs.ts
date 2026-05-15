import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import type { Job, JobsData, LegacyCompany } from '../src/types/jobs';

const CSV_PATH = join(process.cwd(), 'data/jobs.csv');
const JOBS_JSON_PATH = join(process.cwd(), 'public/jobs.json');

export interface CSVRow {
  title: string;
  location: string;
  legacyCompany: string;
  applyUrl: string;
  sourceSystem: string;
}

/**
 * Parse CSV file into rows
 */
export function parseCSV(csvContent: string): CSVRow[] {
  const requiredFields = ['title', 'location', 'legacyCompany', 'applyUrl', 'sourceSystem'];

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  if (records.length === 0) {
    throw new Error('CSV file must contain a header row and at least one data row');
  }

  // Validate header contains all required fields
  const firstRecord = records[0];
  for (const field of requiredFields) {
    if (!(field in firstRecord)) {
      throw new Error(`CSV header missing required field: ${field}`);
    }
  }

  return records as CSVRow[];
}

/**
 * Validate CSV row
 */
export function validateRow(row: CSVRow, rowNumber: number): void {
  const errors: string[] = [];

  if (!row.title || row.title.trim() === '') {
    errors.push('title is required');
  }

  if (!row.location || row.location.trim() === '') {
    errors.push('location is required');
  }

  if (!row.legacyCompany || row.legacyCompany.trim() === '') {
    errors.push('legacyCompany is required');
  } else if (row.legacyCompany !== 'Accelint' && row.legacyCompany !== 'Vitesse') {
    errors.push(`legacyCompany must be "Accelint" or "Vitesse", got "${row.legacyCompany}"`);
  }

  if (!row.applyUrl || row.applyUrl.trim() === '') {
    errors.push('applyUrl is required');
  } else if (!row.applyUrl.startsWith('https://')) {
    errors.push('applyUrl must be an https:// URL');
  }

  if (!row.sourceSystem || row.sourceSystem.trim() === '') {
    errors.push('sourceSystem is required');
  }

  if (errors.length > 0) {
    throw new Error(`Row ${rowNumber}: ${errors.join(', ')}`);
  }
}

/**
 * Convert CSV row to Job record
 */
export function convertToJob(row: CSVRow, index: number): Job {
  const timestamp = new Date().toISOString();

  // Generate ID from company and index
  const idPrefix = row.legacyCompany.toLowerCase();
  const idSuffix = row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const id = `${idPrefix}-manual-${index}-${idSuffix}`.substring(0, 100);

  return {
    id,
    title: row.title.trim(),
    location: row.location.trim(),
    legacyCompany: row.legacyCompany as LegacyCompany,
    applyUrl: row.applyUrl.trim(),
    sourceUrl: row.applyUrl.trim(), // Use applyUrl as sourceUrl for manual imports
    sourceSystem: row.sourceSystem.trim(),
    lastSeenAt: timestamp,
  };
}

/**
 * Main import function
 */
export async function importJobs(): Promise<void> {
  console.log('Reading CSV file...');
  const csvContent = readFileSync(CSV_PATH, 'utf-8');

  console.log('Parsing CSV...');
  const rows = parseCSV(csvContent);
  console.log(`Found ${rows.length} jobs in CSV`);

  console.log('Validating rows...');
  rows.forEach((row, index) => {
    validateRow(row, index + 2); // +2 because row 1 is header, and we're 0-indexed
  });

  console.log('Converting to Job records...');
  const jobs = rows.map((row, index) => convertToJob(row, index));

  const data: JobsData = {
    generatedAt: new Date().toISOString(),
    sourceNotes: [
      'Jobs imported from data/jobs.csv',
      'Manual import - each import replaces all previous data',
    ],
    jobs,
  };

  console.log('Writing to jobs.json...');
  writeFileSync(JOBS_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`✓ Imported ${jobs.length} jobs to ${JOBS_JSON_PATH}`);
  console.log(`✓ Generated at: ${data.generatedAt}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importJobs().catch((error) => {
    console.error('Import failed:', error.message);
    process.exit(1);
  });
}
