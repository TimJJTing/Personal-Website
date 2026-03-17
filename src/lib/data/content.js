/**
 * Shared content-fetching utilities for llms.txt endpoints and other consumers.
 */

const SITE_URL = 'https://jtingjiang.com';

export { SITE_URL };

/**
 * Load the about page metadata (experience, education, skills, interests).
 */
export async function getAboutMeta() {
	const aboutModule = await import('/src/routes/about/about.md');
	return aboutModule.metadata;
}

/**
 * @param {string} path - e.g. '/src/routes/works/foo.md'
 * @returns {string}
 */
function slugFromPath(path) {
	return path.split('/').pop()?.replace('.md', '') ?? '';
}

/**
 * @typedef {{ slug: string, title: string, description: string, year: number, categories: string[], additionalLinks: { title: string, url: string }[] }} WorkMeta
 */

/**
 * Get published works sorted by year (newest first).
 * @param {{ includeBody?: boolean }} [opts]
 * @returns {Promise<(WorkMeta & { body?: string })[]>}
 */
export async function getWorks(opts = {}) {
	const modules = import.meta.glob('/src/routes/works/*.md', { eager: true });

	/** @type {Record<string, string> | null} */
	let rawModules = null;
	if (opts.includeBody) {
		rawModules = /** @type {Record<string, string>} */ (
			import.meta.glob('/src/routes/works/*.md', {
				query: '?raw',
				import: 'default',
				eager: true
			})
		);
	}

	return Object.entries(modules)
		.filter(([, mod]) => /** @type {any} */ (mod).metadata?.published)
		.map(([path, mod]) => {
			const meta = /** @type {any} */ (mod).metadata;
			/** @type {WorkMeta & { body?: string }} */
			const work = {
				slug: slugFromPath(path),
				title: meta.title,
				description: meta.description,
				year: meta.year,
				categories: meta.categories || [],
				additionalLinks: meta.additionalLinks || []
			};
			if (rawModules) {
				work.body = stripFrontmatter(rawModules[path] ?? '');
			}
			return work;
		})
		.sort((a, b) => (b.year || 0) - (a.year || 0));
}

/**
 * @typedef {{ slug: string, title: string, description: string, date: string, slides?: string, additionalLinks: { title: string, url: string }[] }} ArticleMeta
 */

/**
 * Get published articles.
 * @param {{ includeBody?: boolean }} [opts]
 * @returns {Promise<(ArticleMeta & { body?: string })[]>}
 */
export async function getArticles(opts = {}) {
	const modules = import.meta.glob('/src/routes/articles/*.md', { eager: true });

	/** @type {Record<string, string> | null} */
	let rawModules = null;
	if (opts.includeBody) {
		rawModules = /** @type {Record<string, string>} */ (
			import.meta.glob('/src/routes/articles/*.md', {
				query: '?raw',
				import: 'default',
				eager: true
			})
		);
	}

	return Object.entries(modules)
		.filter(([, mod]) => /** @type {any} */ (mod).metadata?.published !== false)
		.map(([path, mod]) => {
			const meta = /** @type {any} */ (mod).metadata;
			/** @type {ArticleMeta & { body?: string }} */
			const article = {
				slug: slugFromPath(path),
				title: meta.title,
				description: meta.description,
				date: meta.date,
				slides: meta.slides,
				additionalLinks: meta.additionalLinks || []
			};
			if (rawModules) {
				article.body = stripFrontmatter(rawModules[path] ?? '');
			}
			return article;
		});
}

/**
 * Strip YAML frontmatter from raw markdown, returning just the body.
 * @param {string} raw
 * @returns {string}
 */
function stripFrontmatter(raw) {
	const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/);
	return match ? match[1].trim() : raw.trim();
}

/**
 * Format a date as "Month Year".
 * @param {string | Date | null | undefined} date
 * @returns {string}
 */
export function formatMonth(date) {
	if (!date) return '';
	const d = date instanceof Date ? date : new Date(date);
	return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

/**
 * Format a date range from an entry with startTime/endTime.
 * @param {{ startTime?: string, endTime?: string }} entry
 * @returns {string}
 */
export function formatDateRange(entry) {
	const start = formatMonth(entry.startTime);
	const end = entry.endTime ? formatMonth(entry.endTime) : 'Present';
	return `${start} to ${end}`;
}

/**
 * Format links as markdown.
 * @param {{ title: string, url: string }[]} links
 * @returns {string}
 */
export function formatLinks(links) {
	return links.map((l) => `[${l.title}](${l.url})`).join(' | ');
}
