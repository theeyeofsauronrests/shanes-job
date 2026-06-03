/**
 * Test script to investigate Vitesse careers page structure
 * Run: npx tsx scripts/test-vitesse-page.ts
 */

import { chromium } from 'playwright';

async function testVitessePage() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false }); // visible for debugging
  const page = await browser.newPage();

  console.log('Navigating to Vitesse careers page...');
  await page.goto('https://vitessesys.com/careers/#open-positions', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  // Wait a bit for any lazy-loaded content
  await page.waitForTimeout(3000);

  console.log('\n=== Page Analysis ===');

  // Check for common job board selectors
  const selectors = [
    'div[class*="job"]',
    'div[class*="position"]',
    'div[class*="opening"]',
    'div[class*="career"]',
    'li[class*="job"]',
    'a[href*="apply"]',
    'a[href*="job"]',
    'a[href*="position"]',
    '[data-job]',
    '[data-position]',
    'iframe',
  ];

  for (const selector of selectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`✓ Found ${count} elements matching: ${selector}`);

      // Show first few matches
      const elements = await page.locator(selector).all();
      for (let i = 0; i < Math.min(3, elements.length); i++) {
        const text = await elements[i].textContent();
        const href = await elements[i].getAttribute('href').catch(() => null);
        console.log(`  [${i}] Text: ${text?.substring(0, 100)}${text && text.length > 100 ? '...' : ''}`);
        if (href) console.log(`      URL: ${href}`);
      }
    }
  }

  // Check for iframes (common for embedded job boards)
  const iframes = await page.locator('iframe').all();
  if (iframes.length > 0) {
    console.log(`\n✓ Found ${iframes.length} iframe(s)`);
    for (let i = 0; i < iframes.length; i++) {
      const src = await iframes[i].getAttribute('src');
      console.log(`  iframe[${i}] src: ${src}`);
    }
  }

  // Dump full page text for manual inspection
  const bodyText = await page.locator('body').textContent();
  console.log('\n=== Page Text (first 500 chars) ===');
  console.log(bodyText?.substring(0, 500));

  // Take a screenshot for manual review
  await page.screenshot({ path: 'vitesse-careers-page.png', fullPage: true });
  console.log('\n✓ Screenshot saved to: vitesse-careers-page.png');

  console.log('\nBrowser left open for manual inspection. Press Ctrl+C when done.');
  // Don't close browser automatically so we can inspect
  // await browser.close();
}

testVitessePage().catch(console.error);
