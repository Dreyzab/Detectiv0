import { test, expect } from '@playwright/test';

const SCENARIO_ROUTE = '/vn/intro_journalist';
const CHOICE_TEST_ID = 'vn-choice-selective_excavation';

async function ensureChoicesVisible(page: import('@playwright/test').Page) {
    const root = page.getByTestId('vn-fullscreen-root');
    const choices = page.getByTestId('vn-choices');

    for (let attempt = 0; attempt < 4; attempt += 1) {
        if (await choices.isVisible()) {
            return;
        }
        await root.click({ position: { x: 24, y: 24 } });
    }

    await expect(choices).toBeVisible();
}

test.describe('Visual Novel Flow', () => {
    test('moves from intro scene to next scene after choosing an option', async ({ page }) => {
        await page.goto(SCENARIO_ROUTE);

        const root = page.getByTestId('vn-fullscreen-root');
        const sceneText = page.getByTestId('vn-scene-text');

        await expect(root).toBeVisible();
        await expect(sceneText).toBeVisible();
        await expect(sceneText).not.toHaveText('', { timeout: 15000 });

        const firstSceneText = ((await sceneText.textContent()) ?? '').trim();
        expect(firstSceneText.length).toBeGreaterThan(0);

        await ensureChoicesVisible(page);

        const choice = page.getByTestId(CHOICE_TEST_ID);
        await expect(choice).toBeVisible();
        await choice.click();

        await expect.poll(async () => ((await sceneText.textContent()) ?? '').trim(), { timeout: 15000 }).not.toBe(firstSceneText);
    });
});
