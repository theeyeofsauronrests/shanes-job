import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Test Vitesse
  console.log('=== VITESSE ===');
  const page1 = await browser.newPage();
  await page1.goto('https://vitessesys.com/careers/#open-positions', { waitUntil: 'networkidle' });
  await page1.waitForTimeout(2000);

  const vitesseText = await page1.locator('body').textContent();
  console.log('Page loaded, text length:', vitesseText?.length);

  // Check for common patterns
  const hasJobs = vitesseText?.toLowerCase().includes('open position') ||
                  vitesseText?.toLowerCase().includes('job') ||
                  vitesseText?.toLowerCase().includes('career');
  console.log('Contains job-related text:', hasJobs);

  const iframes = await page1.locator('iframe').count();
  console.log('Iframes found:', iframes);

  if (iframes > 0) {
    const iframeSrc = await page1.locator('iframe').first().getAttribute('src');
    console.log('First iframe src:', iframeSrc);
  }

  // Test Rippling
  console.log('\n=== RIPPLING ===');
  const page2 = await browser.newPage();
  await page2.goto('https://ats.rippling.com/accelintjobboardtest/jobs', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(2000);

  const jobPostings = await page2.locator('[data-testid="job-posting"]').count();
  console.log('Job postings found:', jobPostings);

  if (jobPostings > 0) {
    const firstJob = await page2.locator('[data-testid="job-posting"]').first();
    const title = await firstJob.locator('h2, h3').first().textContent().catch(() => 'N/A');
    console.log('First job title:', title?.trim());
  }

  await browser.close();
})();
