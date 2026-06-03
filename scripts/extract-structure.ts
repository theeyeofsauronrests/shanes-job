import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Loading Rippling...');
  await page.goto('https://ats.rippling.com/accelintjobboardtest/jobs', {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(5000);

  // Extract job data structure
  const jobs = await page.evaluate(() => {
    const jobLinks = Array.from(document.querySelectorAll('a[href*="/jobs/"]'));

    // Group by job ID (every 2 links is one job: title link + "View job" link)
    const seen = new Set();
    const uniqueJobs = [];

    for (const link of jobLinks) {
      const href = link.getAttribute('href');
      if (!href) continue;

      const match = href.match(/\/jobs\/([a-f0-9-]+)/);
      if (!match) continue;

      const jobId = match[1];
      if (seen.has(jobId)) continue;
      seen.add(jobId);

      const title = link.textContent?.trim();
      if (!title || title === 'View job') continue;

      // Try to find location near this link
      const parent = link.closest('div');
      const locationEl = parent?.querySelector('[class*="location"], [class*="city"]');
      const location = locationEl?.textContent?.trim() || 'Location not found';

      uniqueJobs.push({
        id: jobId,
        title,
        href,
        location
      });
    }

    return uniqueJobs;
  });

  console.log(`\nExtracted ${jobs.length} jobs:\n`);
  jobs.slice(0, 5).forEach((job, i) => {
    console.log(`[${i + 1}] ${job.title}`);
    console.log(`    Location: ${job.location}`);
    console.log(`    URL: https://ats.rippling.com${job.href}`);
    console.log();
  });

  await browser.close();
})();
