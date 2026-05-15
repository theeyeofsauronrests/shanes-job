import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import type { JobsData, Job } from '../src/types/jobs';

const RIPPLING_URL = 'https://ats.rippling.com/accelintjobboardtest/jobs';
const RIPPLING_BASE_URL = 'https://ats.rippling.com';
const JOBS_JSON_PATH = join(process.cwd(), 'public/jobs.json');

interface ParsedJob {
  title: string;
  location: string;
  jobUrl: string;
}

/**
 * Parse HTML from Accelint Rippling job board
 */
export function parseRipplingHTML(html: string): ParsedJob[] {
  const jobs: ParsedJob[] = [];

  // Match job divs with class="accelint-job"
  const jobDivRegex = /<div class="accelint-job">([\s\S]*?)<\/div>/g;
  let jobMatch;

  while ((jobMatch = jobDivRegex.exec(html)) !== null) {
    const jobContent = jobMatch[1];

    // Extract title from <h3>
    const titleMatch = /<h3>(.*?)<\/h3>/.exec(jobContent);
    // Extract location from <p>
    const locationMatch = /<p>(.*?)<\/p>/.exec(jobContent);
    // Extract job URL from <a class="accelint-job-link" href="...">
    const urlMatch = /<a class="accelint-job-link" href="([^"]+)"/.exec(jobContent);

    if (titleMatch && locationMatch && urlMatch) {
      const title = titleMatch[1].trim();
      const location = locationMatch[1].trim();
      const jobUrl = urlMatch[1].trim();

      jobs.push({
        title,
        location,
        jobUrl: jobUrl.startsWith('http') ? jobUrl : `${RIPPLING_BASE_URL}${jobUrl}`,
      });
    }
  }

  return jobs;
}

/**
 * Convert parsed jobs to Job records
 */
export function convertToJobRecords(parsedJobs: ParsedJob[]): Job[] {
  const timestamp = new Date().toISOString();

  return parsedJobs.map((parsedJob) => {
    // Generate ID from URL
    const urlParts = parsedJob.jobUrl.split('/');
    const uuid = urlParts[urlParts.length - 1];
    const id = `accelint-rippling-${uuid}`;

    return {
      id,
      title: parsedJob.title,
      location: parsedJob.location,
      legacyCompany: 'Accelint',
      applyUrl: parsedJob.jobUrl,
      sourceUrl: RIPPLING_URL,
      sourceSystem: 'Rippling',
      lastSeenAt: timestamp,
    };
  });
}

/**
 * Merge Accelint jobs into existing jobs.json
 */
export function mergeJobs(newAccelintJobs: Job[]): JobsData {
  let existingData: JobsData;

  try {
    const existingJson = readFileSync(JOBS_JSON_PATH, 'utf-8');
    existingData = JSON.parse(existingJson);
  } catch (error) {
    // If file doesn't exist or is invalid, start fresh
    existingData = {
      generatedAt: new Date().toISOString(),
      sourceNotes: [],
      jobs: [],
    };
  }

  // Remove old Accelint Rippling jobs
  const nonAccelintJobs = existingData.jobs.filter(
    (job) => !job.id.startsWith('accelint-rippling-')
  );

  // Combine with new Accelint jobs
  const mergedJobs = [...nonAccelintJobs, ...newAccelintJobs];

  return {
    generatedAt: new Date().toISOString(),
    sourceNotes: [
      'Accelint jobs from public Rippling job board.',
      'Vitesse jobs entered from manual export until approved automated source exists.',
    ],
    jobs: mergedJobs,
  };
}

/**
 * Main ingestion function
 */
export async function ingestAccelintJobs(): Promise<void> {
  console.log('Fetching Accelint jobs from Rippling...');

  const response = await fetch(RIPPLING_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch Rippling jobs: ${response.statusText}`);
  }

  const html = await response.text();
  console.log('Parsing HTML...');

  const parsedJobs = parseRipplingHTML(html);
  console.log(`Found ${parsedJobs.length} Accelint jobs`);

  const jobRecords = convertToJobRecords(parsedJobs);
  const mergedData = mergeJobs(jobRecords);

  console.log(`Total jobs after merge: ${mergedData.jobs.length}`);

  writeFileSync(JOBS_JSON_PATH, JSON.stringify(mergedData, null, 2), 'utf-8');
  console.log(`✓ Updated ${JOBS_JSON_PATH}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestAccelintJobs().catch((error) => {
    console.error('Ingestion failed:', error);
    process.exit(1);
  });
}
