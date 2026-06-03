import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // === RIPPLING DEEP DIVE ===
  console.log('=== RIPPLING ANALYSIS ===');
  const page = await browser.newPage();
  await page.goto('https://ats.rippling.com/accelintjobboardtest/jobs', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  // Wait extra time for dynamic content
  await page.waitForTimeout(5000);

  // Get full HTML
  const html = await page.content();
  writeFileSync('rippling-page.html', html);
  console.log('✓ Saved HTML to rippling-page.html');

  // Try various selectors
  const testSelectors = [
    'div',
    'a',
    'h1',
    'h2',
    'h3',
    '[class*="job"]',
    '[class*="posting"]',
    '[class*="position"]',
    '[role="article"]',
    '[role="listitem"]',
  ];

  console.log('\nTesting selectors:');
  for (const selector of testSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0 && count < 200) { // Avoid spam
      console.log(`  ${selector}: ${count} found`);
    }
  }

  // Get all links
  const links = await page.locator('a').all();
  console.log(`\nTotal links found: ${links.length}`);

  const jobLinks = [];
  for (const link of links) {
    const href = await link.getAttribute('href');
    const text = await link.textContent();
    if (href && (href.includes('job') || href.includes('position') || href.includes('apply'))) {
      jobLinks.push({ href, text: text?.substring(0, 50) });
    }
  }

  console.log(`Job-related links: ${jobLinks.length}`);
  jobLinks.slice(0, 5).forEach((link, i) => {
    console.log(`  [${i}] ${link.text} -> ${link.href}`);
  });

  // === VITESSE DEEP DIVE ===
  console.log('\n\n=== VITESSE ANALYSIS ===');
  const page2 = await browser.newPage();
  await page2.goto('https://vitessesys.com/careers/#open-positions', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page2.waitForTimeout(5000);

  const html2 = await page2.content();
  writeFileSync('vitesse-page.html', html2);
  console.log('✓ Saved HTML to vitesse-page.html');

  // Look for "open positions" section
  const bodyText = await page2.locator('body').textContent();
  const hasOpenPositions = bodyText?.toLowerCase().includes('open position');
  console.log('Contains "open position" text:', hasOpenPositions);

  // Search for specific job titles or locations
  const keywords = ['engineer', 'developer', 'analyst', 'manager', 'san diego', 'remote'];
  console.log('\nKeyword search:');
  for (const keyword of keywords) {
    const found = bodyText?.toLowerCase().includes(keyword.toLowerCase());
    if (found) console.log(`  ✓ Found: ${keyword}`);
  }

  // Check all links
  const vitesseLinks = await page2.locator('a').all();
  console.log(`\nTotal links: ${vitesseLinks.length}`);

  const careerLinks = [];
  for (const link of vitesseLinks) {
    const href = await link.getAttribute('href');
    const text = await link.textContent();
    if (href && (
      href.includes('career') ||
      href.includes('job') ||
      href.includes('position') ||
      href.includes('apply') ||
      text?.toLowerCase().includes('position')
    )) {
      careerLinks.push({ href, text: text?.trim().substring(0, 60) });
    }
  }

  console.log(`Career-related links: ${careerLinks.length}`);
  careerLinks.forEach((link, i) => {
    console.log(`  [${i}] ${link.text} -> ${link.href}`);
  });

  await browser.close();
  console.log('\n✓ Test complete');
})();
