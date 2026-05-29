/**
 * Scrape Accelint jobs from Rippling public job board
 * Uses Playwright to render JS-heavy page, then extracts job data from DOM
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';
import type { Job } from '../src/types/jobs';

const RIPPLING_URL = 'https://ats.rippling.com/accelintjobboardtest/jobs';
const OUTPUT_PATH = join(process.cwd(), 'data/accelint-scraped.json');

interface RipplingJob {
  id: string;
  title: string;
  location: string;
  applyUrl: string;
}

export async function scrapeRippling(): Promise<Job[]> {
  console.log('🚀 Starting Rippling scraper...');
  console.log(`📍 URL: ${RIPPLING_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('⏳ Loading page (may take 30+ seconds)...');

    // Increase timeout and use 'load' instead of 'networkidle' (faster)
    await page.goto(RIPPLING_URL, {
      waitUntil: 'load',
      timeout: 60000
    });

    // Wait for job links to appear
    console.log('⏳ Waiting for job listings to render...');
    await page.waitForSelector('a[href*="/jobs/"]', { timeout: 30000 });

    // Give extra time for all jobs to load
    await page.waitForTimeout(3000);

    console.log('✅ Page loaded, extracting jobs...');

    // Extract job data from the embedded JSON data (more reliable than DOM scraping)
    const jobs = await page.evaluate(() => {
      // Rippling embeds job data in __NEXT_DATA__ script tag
      const nextDataScript = document.getElementById('__NEXT_DATA__');
      if (!nextDataScript) {
        throw new Error('Could not find __NEXT_DATA__ - Rippling page structure may have changed');
      }

      const pageData = JSON.parse(nextDataScript.textContent || '{}');
      const jobPosts = pageData?.props?.pageProps?.dehydratedState?.queries?.find(
        (q: any) => q.queryKey?.[0] === 'board' && q.queryKey?.[2] === 'job-posts'
      )?.state?.data?.items || [];

      if (jobPosts.length === 0) {
        throw new Error('No jobs found in page data');
      }

      return jobPosts.map((job: any) => {
        // Extract location from locations array
        let location = 'Location not specified';
        if (job.locations && job.locations.length > 0) {
          const loc = job.locations[0];

          if (loc.workplaceType === 'REMOTE') {
            location = loc.name || 'Remote';
          } else if (loc.city && loc.stateCode) {
            location = `${loc.city}, ${loc.stateCode}`;
          } else if (loc.city && loc.state) {
            location = `${loc.city}, ${loc.state}`;
          } else if (loc.name) {
            location = loc.name;
          }
        }

        return {
          id: job.id,
          title: job.name,
          location,
          href: job.url.replace('https://ats.rippling.com', '')
        };
      });
    });

    console.log(`✅ Extracted ${jobs.length} unique jobs\n`);

    if (jobs.length === 0) {
      throw new Error('No jobs found - page structure may have changed');
    }

    // Convert to Job format
    const timestamp = new Date().toISOString();
    const formattedJobs: Job[] = jobs.map((job) => ({
      id: `accelint-scraped-${job.id}`,
      title: job.title,
      location: job.location,
      legacyCompany: 'Accelint',
      applyUrl: `https://ats.rippling.com${job.href}`,
      sourceUrl: RIPPLING_URL,
      sourceSystem: 'Rippling',
      lastSeenAt: timestamp
    }));

    // Save to file
    const output = {
      generatedAt: timestamp,
      source: 'Rippling',
      sourceUrl: RIPPLING_URL,
      jobCount: formattedJobs.length,
      jobs: formattedJobs
    };

    writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`💾 Saved to: ${OUTPUT_PATH}`);
    console.log(`📊 Total jobs: ${formattedJobs.length}\n`);

    // Show sample
    console.log('📋 Sample jobs:');
    formattedJobs.slice(0, 3).forEach((job, i) => {
      console.log(`  ${i + 1}. ${job.title}`);
      console.log(`     Location: ${job.location}`);
      console.log(`     URL: ${job.applyUrl}\n`);
    });

    await browser.close();
    return formattedJobs;

  } catch (error) {
    await browser.close();
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeRippling()
    .then(() => {
      console.log('✅ Scraping complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Scraping failed:', error.message);
      process.exit(1);
    });
}
