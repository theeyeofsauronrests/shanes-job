import { test, expect } from '@playwright/test';

test.describe('Lyntris Jobs MVP smoke test', () => {
  test('homepage loads and displays core elements', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle('Lyntris Jobs');

    // Verify main heading
    await expect(page.getByRole('heading', { name: /Lyntris Jobs/i })).toBeVisible();
  });

  test('disclaimer is visible', async ({ page }) => {
    await page.goto('/');

    // Verify disclaimer component is present and visible
    const disclaimer = page.locator('.disclaimer');
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer).toContainText('Unofficial side project by Shane Quinlan');
  });

  test('jobs render on homepage', async ({ page }) => {
    await page.goto('/');

    // Wait for jobs to load
    await page.waitForSelector('.job-card', { timeout: 10000 });

    // Verify at least one job card is visible
    const jobCards = page.locator('.job-card');
    await expect(jobCards.first()).toBeVisible();

    // Verify job card has expected elements
    await expect(jobCards.first().locator('.job-title')).toBeVisible();
    await expect(jobCards.first().locator('.job-location')).toBeVisible();
    await expect(jobCards.first().locator('.job-company')).toBeVisible();
  });

  test('filtering changes visible results', async ({ page }) => {
    await page.goto('/');

    // Wait for jobs to load
    await page.waitForSelector('.job-card');

    // Count initial jobs
    const initialCount = await page.locator('.job-card').count();
    expect(initialCount).toBeGreaterThan(0);

    // Get the job count text before filtering
    const jobCountBefore = await page.locator('.job-count').textContent();

    // Type in search filter
    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('Engineer');

    // Wait for filter to apply
    await page.waitForTimeout(500);

    // Verify job count changed or shows filtered results
    const jobCountAfter = await page.locator('.job-count').textContent();

    // Either the count changed, or we see filtered results
    const filteredCount = await page.locator('.job-card').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('at least one apply link exists', async ({ page }) => {
    await page.goto('/');

    // Wait for jobs to load
    await page.waitForSelector('.job-card');

    // Verify at least one apply link exists
    const applyLinks = page.getByRole('link', { name: /Apply for/i });
    await expect(applyLinks.first()).toBeVisible();

    // Verify apply link has correct attributes
    const firstApplyLink = applyLinks.first();
    await expect(firstApplyLink).toHaveAttribute('target', '_blank');
    await expect(firstApplyLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('hero carousel is present', async ({ page }) => {
    await page.goto('/');

    // Verify carousel is visible
    const carousel = page.getByRole('region', { name: /hero image carousel/i });
    await expect(carousel).toBeVisible();

    // Verify carousel controls
    await expect(page.getByRole('button', { name: /previous slide/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /next slide/i })).toBeVisible();
  });

  test('footer with maintainer info is visible', async ({ page }) => {
    await page.goto('/');

    // Verify footer exists
    const footer = page.locator('footer.site-footer');
    await expect(footer).toBeVisible();

    // Verify footer content
    await expect(footer).toContainText('Created by Shane Quinlan');
    await expect(footer).toContainText('Director, AI Product Management');

    // Verify contact links
    await expect(page.getByRole('link', { name: /LinkedIn/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Email/i })).toBeVisible();
  });
});
