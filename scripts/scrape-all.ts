/**
 * Master scraper script - runs both Accelint and Vitesse scrapers,
 * merges results, and generates final output files
 */

import { scrapeRippling } from './scrape-rippling';
import { scrapeVitesse } from './scrape-vitesse';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Job, JobsData } from '../src/types/jobs';

const PUBLIC_JOBS_PATH = join(process.cwd(), 'public/jobs.json');
const API_DIR = join(process.cwd(), 'api');
const API_JOBS_PATH = join(API_DIR, 'jobs.json');
const API_METADATA_PATH = join(API_DIR, 'metadata.json');

async function scrapeAll() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🚀 Lyntris Jobs - Automated Scraper');
  console.log('═══════════════════════════════════════════════════\n');

  const errors: string[] = [];
  let accelintJobs: Job[] = [];
  let vitesseJobs: Job[] = [];

  // Scrape Accelint (Rippling)
  try {
    console.log('📍 [1/2] Scraping Accelint from Rippling...\n');
    accelintJobs = await scrapeRippling();
    console.log(`✅ Accelint: ${accelintJobs.length} jobs\n`);
  } catch (error: any) {
    console.error(`❌ Accelint scraping failed: ${error.message}\n`);
    errors.push(`Accelint: ${error.message}`);
  }

  // Scrape Vitesse (ADP)
  try {
    console.log('📍 [2/2] Scraping Vitesse from ADP...\n');
    vitesseJobs = await scrapeVitesse();
    console.log(`✅ Vitesse: ${vitesseJobs.length} jobs\n`);
  } catch (error: any) {
    console.error(`❌ Vitesse scraping failed: ${error.message}\n`);
    errors.push(`Vitesse: ${error.message}`);
  }

  // If both failed, exit
  if (accelintJobs.length === 0 && vitesseJobs.length === 0) {
    console.error('❌ Both scrapers failed - no jobs to save');
    console.error('Errors:', errors);
    process.exit(1);
  }

  // Merge jobs
  const allJobs = [...accelintJobs, ...vitesseJobs];
  const timestamp = new Date().toISOString();

  console.log('═══════════════════════════════════════════════════');
  console.log('📊 Scraping Summary');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Accelint (Rippling): ${accelintJobs.length} jobs`);
  console.log(`Vitesse (ADP):       ${vitesseJobs.length} jobs`);
  console.log(`Total:               ${allJobs.length} jobs`);
  if (errors.length > 0) {
    console.log(`⚠️  Errors:            ${errors.length}`);
    errors.forEach(err => console.log(`   - ${err}`));
  }
  console.log();

  // Generate public/jobs.json (for static site)
  const publicData: JobsData = {
    generatedAt: timestamp,
    sourceNotes: [
      `Accelint: ${accelintJobs.length} jobs scraped from Rippling`,
      `Vitesse: ${vitesseJobs.length} jobs scraped from ADP`,
      'Automated via on-demand scraper script'
    ],
    jobs: allJobs
  };

  writeFileSync(PUBLIC_JOBS_PATH, JSON.stringify(publicData, null, 2), 'utf-8');
  console.log(`💾 Saved: ${PUBLIC_JOBS_PATH}`);

  // Generate api/jobs.json (for external consumers)
  mkdirSync(API_DIR, { recursive: true });

  const apiData = {
    version: '1.0',
    generatedAt: timestamp,
    sources: [
      {
        name: 'Accelint',
        system: 'Rippling',
        method: 'DOM Scraping',
        lastScraped: timestamp,
        jobCount: accelintJobs.length,
        status: accelintJobs.length > 0 ? 'success' : 'failed'
      },
      {
        name: 'Vitesse',
        system: 'ADP',
        method: 'API Interception',
        lastScraped: timestamp,
        jobCount: vitesseJobs.length,
        status: vitesseJobs.length > 0 ? 'success' : 'failed'
      }
    ],
    totalJobs: allJobs.length,
    jobs: allJobs,
    accessUrl: 'https://beta-lyntris-jobs.vercel.app/api/jobs.json',
    cors: 'enabled'
  };

  writeFileSync(API_JOBS_PATH, JSON.stringify(apiData, null, 2), 'utf-8');
  console.log(`💾 Saved: ${API_JOBS_PATH}`);

  // Generate api/metadata.json (for monitoring)
  const metadata = {
    lastSuccessfulScrape: timestamp,
    sources: apiData.sources,
    totalJobs: allJobs.length,
    warnings: errors,
    scrapeMethod: 'on-demand'
  };

  writeFileSync(API_METADATA_PATH, JSON.stringify(metadata, null, 2), 'utf-8');
  console.log(`💾 Saved: ${API_METADATA_PATH}`);

  console.log('\n✅ All done! Run `npm run dev` to see the updated jobs.\n');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAll()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}
