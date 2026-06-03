/**
 * Test script to investigate Accelint Rippling page structure
 * Run: npx tsx scripts/test-rippling-page.ts
 */

import { chromium } from 'playwright';

async function testRipplingPage() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Navigating to Accelint Rippling job board...');
  await page.goto('https://ats.rippling.com/accelintjobboardtest/jobs', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(3000);

  console.log('\n=== Page Analysis ===');

  const selectors = [
    '[data-testid="job-posting"]',
    'div[class*="job"]',
    'div[class*="posting"]',
    'a[href*="/job/"]',
    'a[href*="apply"]',
    'h2',
    'h3',
  ];

  for (const selector of selectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`✓ Found ${count} elements matching: ${selector}`);

      const elements = await page.locator(selector).all();
      for (let i = 0; i < Math.min(3, elements.length); i++) {
        const text = await elements[i].textContent();
        const href = await elements[i].getAttribute('href').catch(() => null);
        console.log(`  [${i}] Text: ${text?.substring(0, 100).replace(/\n/g, ' ')}${text && text.length > 100 ? '...' : ''}`);
        if (href) console.log(`      URL: ${href}`);
      }
    }
  }

  // Try extracting job data
  console.log('\n=== Attempting Job Extraction ===');

  const jobElements = await page.locator('[data-testid="job-posting"]').all();
  console.log(`Found ${jobElements.length} job postings\n`);

  for (let i = 0; i < Math.min(3, jobElements.length); i++) {
    const jobEl = jobElements[i];
    const title = await jobEl.locator('h2, h3').first().textContent().catch(() => 'N/A');
    const link = await jobEl.locator('a').first().getAttribute('href').catch(() => 'N/A');

    console.log(`Job ${i + 1}:`);
    console.log(`  Title: ${title}`);
    console.log(`  Link: ${link}`);
  }

  await page.screenshot({ path: 'rippling-jobs-page.png', fullPage: true });
  console.log('\n✓ Screenshot saved to: rippling-jobs-page.png');

  console.log('\nBrowser left open for manual inspection. Press Ctrl+C when done.');
}

testRipplingPage().catch(console.error);
