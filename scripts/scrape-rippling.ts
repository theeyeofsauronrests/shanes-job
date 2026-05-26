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

    // Extract job data from rendered DOM
    const jobs = await page.evaluate(() => {
      const jobLinks = Array.from(document.querySelectorAll('a[href*="/jobs/"]'));
      const seen = new Set<string>();
      const extracted: Array<{
        id: string;
        title: string;
        location: string;
        href: string;
      }> = [];

      for (const link of jobLinks) {
        const href = link.getAttribute('href');
        if (!href) continue;

        // Extract job ID from URL
        const match = href.match(/\/jobs\/([a-f0-9-]+)/);
        if (!match) continue;

        const jobId = match[1];
        if (seen.has(jobId)) continue;

        const title = link.textContent?.trim();

        // Skip "View job" links and empty titles
        if (!title || title === 'View job' || title.length < 3) continue;

        seen.add(jobId);

        // Try to find location nearby
        let location = 'Location not specified';

        // Strategy 1: Look for location in parent container
        const parent = link.closest('div');
        if (parent) {
          // Look for common location patterns
          const text = parent.textContent || '';

          // Check for city, state patterns
          const cityStateMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})/);
          if (cityStateMatch) {
            location = `${cityStateMatch[1]}, ${cityStateMatch[2]}`;
          } else if (text.includes('Remote')) {
            location = 'Remote';
          }
        }

        extracted.push({
          id: jobId,
          title,
          location,
          href
        });
      }

      return extracted;
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
