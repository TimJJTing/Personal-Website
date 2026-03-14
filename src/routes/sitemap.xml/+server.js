const siteUrl = 'https://jtingjiang.com';

export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	// Import all works and articles
	const workModules = import.meta.glob('/src/routes/works/*.md', { eager: true });
	const articleModules = import.meta.glob('/src/routes/articles/*.md', { eager: true });

	// Static pages
	const staticPages = [
		{ url: '/', changefreq: 'monthly', priority: '1.0' },
		{ url: '/about', changefreq: 'monthly', priority: '0.9' }
	];

	// Generate work entries
	const workEntries = Object.entries(workModules)
		.filter(([, module]) => /** @type {any} */ (module).metadata?.published)
		.map(([path]) => {
			const slug = path.split('/').pop()?.replace('.md', '');
			return { url: `/works/${slug}`, changefreq: 'yearly', priority: '0.7' };
		});

	// Generate article entries
	const articleEntries = Object.entries(articleModules)
		.filter(([, module]) => /** @type {any} */ (module).metadata?.published !== false)
		.map(([path]) => {
			const slug = path.split('/').pop()?.replace('.md', '');
			return { url: `/articles/${slug}`, changefreq: 'yearly', priority: '0.6' };
		});

	const allPages = [...staticPages, ...workEntries, ...articleEntries];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
