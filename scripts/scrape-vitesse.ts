/**
 * Fetch Vitesse jobs from ADP Workforce Now API
 * Loads the Vitesse careers page and intercepts the ADP API call
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';
import type { Job } from '../src/types/jobs';

const VITESSE_CAREERS_URL = 'https://vitessesys.com/careers/#open-positions';
const OUTPUT_PATH = join(process.cwd(), 'data/vitesse-scraped.json');

interface ADPJobRequisition {
  itemID?: string;
  requisitionID?: string;
  requisitionTitle?: string;
  jobTitle?: string;
  title?: string;
  requisitionLocations?: Array<{
    address?: {
      cityName?: string;
      countrySubdivisionLevel1?: {
        codeValue?: string;
      };
    };
  }>;
  primaryWorkLocation?: {
    cityName?: string;
    stateCode?: string;
  };
  location?: string;
  applyLink?: string;
  jobLink?: string;
  links?: Array<{ href?: string; rel?: string }>;
  [key: string]: any;
}

export async function scrapeVitesse(): Promise<Job[]> {
  console.log('🚀 Starting Vitesse scraper...');
  console.log('📍 Source: Vitesse careers page (intercepts ADP API)\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  try {
    // Step 1: Load page to get the initial API call and extract base URL parameters
    console.log('⏳ Loading Vitesse careers page to capture API URL...');
    const page = await context.newPage();

    let apiBaseUrl: string | null = null;

    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('workforcenow.adp.com') && url.includes('job-requisitions')) {
        apiBaseUrl = url.split('&$skip=')[0].split('&$top=')[0]; // Remove pagination params
        console.log('✅ Captured API base URL');
      }
    });

    await page.goto(VITESSE_CAREERS_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForTimeout(3000);
    await page.close();

    if (!apiBaseUrl) {
      throw new Error('Failed to capture ADP API URL from page');
    }

    // Step 2: Fetch all pages by navigating to API URLs in browser
    console.log('⏳ Fetching all job pages from ADP API...\n');

    const allJobs: any[] = [];
    const pageSize = 50; // Request more per page to reduce requests
    let skip = 0;
    let hasMore = true;
    let pageNum = 1;

    const apiPage = await context.newPage();

    while (hasMore) {
      const pageUrl = `${apiBaseUrl}&$skip=${skip}&$top=${pageSize}`;
      console.log(`   Fetching page ${pageNum} (skip=${skip})...`);

      try {
        await apiPage.goto(pageUrl, { waitUntil: 'networkidle', timeout: 15000 });

        // Extract JSON from page (ADP returns raw JSON in <pre> tag)
        const jsonText = await apiPage.locator('body').textContent();
        if (!jsonText) {
          console.warn(`⚠️  Page ${pageNum}: No content`);
          break;
        }

        const pageData = JSON.parse(jsonText);

      // Extract jobs array from response
      let jobsArray: any[] = [];
      if (Array.isArray(pageData)) {
        jobsArray = pageData;
      } else if (pageData.jobRequisitions && Array.isArray(pageData.jobRequisitions)) {
        jobsArray = pageData.jobRequisitions;
      } else if (pageData.data && Array.isArray(pageData.data)) {
        jobsArray = pageData.data;
      } else {
        // Try to find an array in the response
        for (const key of Object.keys(pageData)) {
          if (Array.isArray(pageData[key]) && pageData[key].length > 0) {
            jobsArray = pageData[key];
            break;
          }
        }
      }

      if (jobsArray.length === 0) {
        console.log(`   Page ${pageNum}: No more jobs found`);
        hasMore = false;
      } else {
        console.log(`   Page ${pageNum}: Found ${jobsArray.length} jobs`);
        allJobs.push(...jobsArray);

        // ADP seems to have a max page size - keep fetching until we get 0
        // We'll increment by the actual number we got
        skip += jobsArray.length;
        pageNum++;

        // Extra check: if we got very few jobs, might be the end
        if (jobsArray.length < 5) {
          console.log(`   Received < 5 jobs, likely last page`);
          hasMore = false;
        }
      }

      // Safety: don't infinite loop
      if (pageNum > 20) {
        console.warn('⚠️  Reached page limit (20) - stopping');
        break;
      }

      } catch (error: any) {
        console.warn(`⚠️  Page ${pageNum} error: ${error.message}`);
        break;
      }
    }

    await apiPage.close();
    await browser.close();

    console.log(`\n✅ Fetched ${allJobs.length} total jobs across ${pageNum} page(s)`);

    // Deduplicate by itemID (ADP sometimes returns duplicates across pages)
    const uniqueJobs = Array.from(
      new Map(allJobs.map(job => [job.itemID, job])).values()
    );

    if (uniqueJobs.length < allJobs.length) {
      console.log(`⚠️  Removed ${allJobs.length - uniqueJobs.length} duplicate(s)\n`);
    } else {
      console.log();
    }

    // Debug: save raw API response
    writeFileSync('data/vitesse-raw-api.json', JSON.stringify(uniqueJobs, null, 2), 'utf-8');
    console.log('💾 Saved raw API data to: data/vitesse-raw-api.json\n');

    const apiData = { jobRequisitions: uniqueJobs };

    // Extract jobs array (we wrapped it above)
    const jobsArray: ADPJobRequisition[] = apiData.jobRequisitions || [];

    console.log(`📊 Total jobs collected: ${jobsArray.length}\n`);

    if (jobsArray.length === 0) {
      console.warn('⚠️  No jobs found - API may have changed or no positions are open');
      console.warn('   Saving empty result...');
    }

    // Convert to Job format
    const timestamp = new Date().toISOString();
    const formattedJobs: Job[] = jobsArray.map((adpJob, index) => {
      // Extract fields with fallbacks for different API schemas
      const requisitionId = adpJob.itemID || adpJob.requisitionID || adpJob.jobRequisitionID || `unknown-${index}`;
      const title = adpJob.requisitionTitle || adpJob.jobTitle || adpJob.title || 'Untitled Position';

      // Build location string
      let location = 'Location not specified';

      // Try requisitionLocations first (most reliable)
      if (adpJob.requisitionLocations && adpJob.requisitionLocations.length > 0) {
        const locData = adpJob.requisitionLocations[0].address;
        if (locData) {
          const parts = [];
          if (locData.cityName) parts.push(locData.cityName);
          if (locData.countrySubdivisionLevel1?.codeValue) {
            parts.push(locData.countrySubdivisionLevel1.codeValue);
          }
          if (parts.length > 0) {
            location = parts.join(', ');
          }
        }
      }
      // Fallback to other location fields
      else if (adpJob.primaryWorkLocation) {
        const parts = [];
        if (adpJob.primaryWorkLocation.cityName) parts.push(adpJob.primaryWorkLocation.cityName);
        if (adpJob.primaryWorkLocation.stateCode) parts.push(adpJob.primaryWorkLocation.stateCode);
        if (parts.length > 0) {
          location = parts.join(', ');
        }
      } else if (adpJob.location) {
        location = String(adpJob.location);
      }

      // Apply URL - look in links array or use fallback
      let applyUrl = 'https://vitessesys.com/careers/';
      if (adpJob.links && Array.isArray(adpJob.links)) {
        const applyLink = adpJob.links.find(link =>
          link.rel === 'apply' || link.rel === 'details' || link.href
        );
        if (applyLink?.href) {
          applyUrl = applyLink.href;
        }
      }
      if (!applyUrl || applyUrl === 'https://vitessesys.com/careers/') {
        applyUrl = adpJob.applyLink || adpJob.jobLink || 'https://vitessesys.com/careers/';
      }

      return {
        id: `vitesse-scraped-${requisitionId}`,
        title,
        location,
        legacyCompany: 'Vitesse' as const,
        applyUrl,
        sourceUrl: 'https://vitessesys.com/careers/',
        sourceSystem: 'ADP',
        lastSeenAt: timestamp
      };
    });

    // Save to file
    const output = {
      generatedAt: timestamp,
      source: 'ADP Workforce Now API',
      sourceUrl: VITESSE_CAREERS_URL,
      jobCount: formattedJobs.length,
      jobs: formattedJobs
    };

    writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`💾 Saved to: ${OUTPUT_PATH}`);
    console.log(`📊 Total jobs: ${formattedJobs.length}\n`);

    if (formattedJobs.length > 0) {
      console.log('📋 Sample jobs:');
      formattedJobs.slice(0, 3).forEach((job, i) => {
        console.log(`  ${i + 1}. ${job.title}`);
        console.log(`     Location: ${job.location}`);
        console.log(`     URL: ${job.applyUrl}\n`);
      });
    }

    return formattedJobs;

  } catch (error) {
    await browser.close();
    console.error('❌ Error fetching from ADP API:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeVitesse()
    .then(() => {
      console.log('✅ Scraping complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Scraping failed:', error.message);
      process.exit(1);
    });
}
