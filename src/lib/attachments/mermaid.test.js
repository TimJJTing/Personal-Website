import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const initialize = vi.fn();
const run = vi.fn().mockResolvedValue(undefined);

function container() {
	return /** @type {Element} */ (
		/** @type {unknown} */ ({
			querySelectorAll: () => [{ textContent: 'flowchart LR\nA --> B' }]
		})
	);
}

beforeEach(() => {
	vi.resetModules();
	initialize.mockReset();
	run.mockReset().mockResolvedValue(undefined);
	vi.doMock('mermaid', () => ({ default: { initialize, run } }));
});

afterEach(() => {
	vi.restoreAllMocks();
});

test('shares initialization across attachments', async () => {
	const { mermaid } = await import('./mermaid.js');
	mermaid()(container());
	mermaid()(container());
	await vi.waitFor(() => expect(run).toHaveBeenCalledTimes(2));
	expect(initialize).toHaveBeenCalledExactlyOnceWith({ startOnLoad: false, theme: 'dark' });
});

test('does not start rendering after cleanup while the import is pending', async () => {
	const { mermaid } = await import('./mermaid.js');
	const cleanup = mermaid()(container());
	if (typeof cleanup === 'function') cleanup();
	mermaid()(container());
	await vi.waitFor(() => expect(run).toHaveBeenCalledTimes(1));
});

test('catches import failures and allows a later attachment to retry', async () => {
	const error = new Error('Import failed');
	const log = vi.spyOn(console, 'error').mockImplementation(() => {});
	vi.doMock('mermaid', () => {
		throw error;
	});
	const { mermaid } = await import('./mermaid.js');
	mermaid()(container());
	await vi.waitFor(() =>
		expect(log).toHaveBeenCalledWith(
			'Mermaid render failed',
			expect.objectContaining({ cause: error })
		)
	);
	vi.doMock('mermaid', () => ({ default: { initialize, run } }));
	mermaid()(container());
	await vi.waitFor(() => expect(run).toHaveBeenCalledTimes(1));
});

test('catches rendering failures', async () => {
	const error = new Error('Invalid diagram');
	const log = vi.spyOn(console, 'error').mockImplementation(() => {});
	run.mockRejectedValueOnce(error);
	const { mermaid } = await import('./mermaid.js');
	mermaid()(container());
	await vi.waitFor(() => expect(log).toHaveBeenCalledWith('Mermaid render failed', error));
});
