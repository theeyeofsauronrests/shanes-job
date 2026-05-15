import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // Basic smoke test to verify the app renders
  await expect(page.locator('body')).toBeVisible();
});
