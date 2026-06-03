import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Loading Rippling...');
  await page.goto('https://ats.rippling.com/accelintjobboardtest/jobs', {
    waitUntil: 'load',
    timeout: 60000
  });

  await page.waitForSelector('a[href*="/jobs/"]', { timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('\nExtracting job structure with locations...\n');

  // Get detailed structure of first few jobs
  const jobStructure = await page.evaluate(() => {
    const jobLinks = Array.from(document.querySelectorAll('a[href*="/jobs/"]'));
    const results = [];

    for (let i = 0; i < Math.min(3, jobLinks.length); i++) {
      const link = jobLinks[i];
      const title = link.textContent?.trim();

      if (!title || title === 'View job') continue;

      // Get all text content near this link
      const parent = link.closest('div');
      const grandparent = parent?.parentElement;
      const greatGrandparent = grandparent?.parentElement;

      results.push({
        title,
        parentText: parent?.textContent?.trim().substring(0, 200),
        grandparentText: grandparent?.textContent?.trim().substring(0, 200),
        greatGrandparentText: greatGrandparent?.textContent?.trim().substring(0, 200),
        parentHTML: parent?.outerHTML.substring(0, 500),
      });
    }

    return results;
  });

  jobStructure.forEach((job, i) => {
    console.log(`\n=== Job ${i + 1}: ${job.title} ===`);
    console.log('Parent text:', job.parentText);
    console.log('\nParent HTML (first 500 chars):', job.parentHTML);
  });

  // Also try to find any elements with location-like content
  console.log('\n\n=== Looking for location patterns ===');
  const locationPatterns = await page.evaluate(() => {
    const allText = document.body.textContent || '';
    const lines = allText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Look for city, state patterns
    const locationLines = lines.filter(line =>
      /[A-Z][a-z]+,\s*[A-Z]{2}/.test(line) || // "City, ST"
      line.includes('Remote') ||
      line.includes('Hybrid')
    );

    return locationLines.slice(0, 10);
  });

  console.log('Found location-like text:');
  locationPatterns.forEach(loc => console.log(`  - ${loc}`));

  await browser.close();
})();
