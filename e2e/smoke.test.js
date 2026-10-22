import { expect, test } from '@playwright/test';

const pages = ['/', '/about', '/works', '/articles', '/works/escaping-flatland'];

for (const path of pages) {
	test(`${path} renders without errors`, async ({ page }) => {
		/** @type {string[]} */
		const errors = [];
		page.on('pageerror', (error) => errors.push(error.message));

		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		await expect(page.locator('main')).toBeVisible();
		expect(errors).toEqual([]);
	});
}

test('item cards navigate client-side', async ({ page }) => {
	await page.goto('/works');
	await page.locator('.item-card').first().click();
	await expect(page).toHaveURL(/\/works\/.+/);
	await expect(page.locator('article h1')).toBeVisible();
});

test('resume PDF is served', async ({ request }) => {
	const response = await request.get('/about/Jie-Ting_Jiang_Resume.pdf');
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toBe('application/pdf');
});

test('sitemap lists works and articles', async ({ request }) => {
	const body = await (await request.get('/sitemap.xml')).text();
	expect(body).toContain('/works/');
	expect(body).toContain('/articles/');
});
