import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import type { Discipline, Job, JobsData } from '../src/types/jobs';
import { DISCIPLINES } from '../src/types/jobs';
import { inferDiscipline } from '../src/utils/roleFilter';

const CSV_PATH = join(process.cwd(), 'data/jobs.csv');
const JOBS_JSON_PATH = join(process.cwd(), 'public/jobs.json');

export type CSVRow = {
  title: string;
  location: string;
  company: string;
  applyUrl: string;
  sourceSystem: string;
  department?: string;
  discipline?: string;
};

const REQUIRED_FIELDS = ['title', 'location', 'company', 'applyUrl', 'sourceSystem'] as const;

function isDiscipline(value: string): value is Discipline {
  return DISCIPLINES.includes(value as Discipline);
}

function createManualJobId(row: CSVRow, index: number): string {
  const company = row.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const title = row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${company}-manual-${index}-${title}`.substring(0, 100);
}

export function parseCSV(csvContent: string): CSVRow[] {
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  if (records.length === 0) {
    throw new Error('CSV file must contain a header row and at least one data row');
  }

  const firstRecord = records[0];
  for (const field of REQUIRED_FIELDS) {
    if (!(field in firstRecord)) {
      throw new Error(`CSV header missing required field: ${field}`);
    }
  }

  return records.map((record) => ({
    title: record.title ?? '',
    location: record.location ?? '',
    company: record.company ?? '',
    applyUrl: record.applyUrl ?? '',
    sourceSystem: record.sourceSystem ?? '',
    department: record.department,
    discipline: record.discipline,
  }));
}

export function validateRow(row: CSVRow, rowNumber: number): void {
  const errors: string[] = [];

  if (!row.title.trim()) {
    errors.push('title is required');
  }

  if (!row.location.trim()) {
    errors.push('location is required');
  }

  if (!row.company.trim()) {
    errors.push('company is required');
  }

  if (!row.applyUrl.trim()) {
    errors.push('applyUrl is required');
  } else if (!row.applyUrl.trim().startsWith('https://')) {
    errors.push('applyUrl must be an https:// URL');
  }

  if (!row.sourceSystem.trim()) {
    errors.push('sourceSystem is required');
  }

  if (row.discipline && !isDiscipline(row.discipline.trim())) {
    errors.push(`discipline must be one of ${DISCIPLINES.join(', ')}`);
  }

  if (errors.length > 0) {
    throw new Error(`Row ${rowNumber}: ${errors.join(', ')}`);
  }
}

export function convertToJob(row: CSVRow, index: number): Job {
  const timestamp = new Date().toISOString();
  const department = row.department?.trim() || undefined;
  const discipline = row.discipline?.trim() || inferDiscipline({
    title: row.title,
    department,
  });

  return {
    id: createManualJobId(row, index),
    title: row.title.trim(),
    location: row.location.trim(),
    company: row.company.trim(),
    discipline: isDiscipline(discipline ?? '') ? discipline : undefined,
    department,
    applyUrl: row.applyUrl.trim(),
    sourceUrl: row.applyUrl.trim(),
    sourceSystem: row.sourceSystem.trim(),
    lastSeenAt: timestamp,
  };
}

export async function importJobs(): Promise<void> {
  console.log('Reading CSV file...');
  const csvContent = readFileSync(CSV_PATH, 'utf-8');

  console.log('Parsing CSV...');
  const rows = parseCSV(csvContent);
  console.log(`Found ${rows.length} jobs in CSV`);

  console.log('Validating rows...');
  rows.forEach((row, index) => {
    validateRow(row, index + 2);
  });

  console.log('Converting to Job records...');
  const jobs = rows.map((row, index) => convertToJob(row, index));

  const data: JobsData = {
    generatedAt: new Date().toISOString(),
    sourceNotes: [
      'Jobs imported from data/jobs.csv',
      'Manual import replaces all previous data',
    ],
    jobs,
  };

  console.log('Writing to jobs.json...');
  writeFileSync(JOBS_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`Imported ${jobs.length} jobs to ${JOBS_JSON_PATH}`);
  console.log(`Generated at: ${data.generatedAt}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  importJobs().catch((error) => {
    console.error('Import failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
