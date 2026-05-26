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
  const page = await browser.newPage();

  try {
    let apiData: any = null;

    // Intercept API responses
    page.on('response', async (response) => {
      const url = response.url();

      // Look for ADP API call
      if (url.includes('workforcenow.adp.com') && url.includes('job-requisitions')) {
        console.log('✅ Intercepted ADP API call');
        try {
          apiData = await response.json();
        } catch (err) {
          console.warn('⚠️  Failed to parse API response:', err);
        }
      }
    });

    console.log('⏳ Loading Vitesse careers page...');
    await page.goto(VITESSE_CAREERS_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait a bit for API call to happen
    await page.waitForTimeout(5000);

    await browser.close();

    if (!apiData) {
      console.warn('⚠️  No ADP API data intercepted - page may have changed');
      console.warn('   Saving empty result...');
      apiData = [];
    }

    console.log('✅ API data captured\n');

    // Debug: save raw API response
    writeFileSync('data/vitesse-raw-api.json', JSON.stringify(apiData, null, 2), 'utf-8');
    console.log('💾 Saved raw API data to: data/vitesse-raw-api.json\n');

    // ADP API response structure may vary, handle multiple formats
    let jobsArray: ADPJobRequisition[] = [];

    if (Array.isArray(apiData)) {
      jobsArray = apiData;
    } else if (apiData.jobRequisitions && Array.isArray(apiData.jobRequisitions)) {
      jobsArray = apiData.jobRequisitions;
    } else if (apiData.data && Array.isArray(apiData.data)) {
      jobsArray = apiData.data;
    } else {
      console.warn('⚠️  Unexpected API response structure:', Object.keys(apiData));
      // Try to find arrays in the response
      for (const key of Object.keys(apiData)) {
        if (Array.isArray(apiData[key]) && apiData[key].length > 0) {
          console.log(`   Using array from key: ${key}`);
          jobsArray = apiData[key];
          break;
        }
      }
    }

    console.log(`📊 Found ${jobsArray.length} jobs in API response\n`);

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
