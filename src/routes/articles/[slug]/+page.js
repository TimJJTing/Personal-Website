import { error } from '@sveltejs/kit';

// TODO
export const prerender = false;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	try {
		const article = await import(`../${params.slug}.md`);
		return {
			content: article.default,
			meta: article.metadata
		};
	} catch (e) {
		error(404, ` Could not find ${params.slug}`);
	}
}
