import { error } from '@sveltejs/kit';

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	try {
		const work = await import(`../${params.slug}.md`);
		return {
			content: work.default,
			meta: work.metadata
		};
	} catch (e) {
		error(404, ` Could not find ${params.slug}`);
	}
}
