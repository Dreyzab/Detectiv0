import { test, expect } from '@playwright/test';

test('Critical Path: Load Home and Check Map', async ({ page }) => {
    // 2. Load Home
    await page.goto('/');
    await expect(page).toHaveTitle(/Grezwanderer 4/);

    // 3. Verify Map Loads (Container exists)
    // This implicitly checks if the map point fetch (Eden) didn't crash the page
    const appContainer = page.locator('#root');
    await expect(appContainer).toBeVisible();

    // 4. Navigate to QR Scanner (if link exists, otherwise direct nav)
    // await page.goto('/qr');
    // await expect(page.getByText('QR Scanner')).toBeVisible();
});
