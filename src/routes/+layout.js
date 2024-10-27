import { error } from '@sveltejs/kit';

export const prerender = true;

/** @type {import('./$types').LayoutLoad} */
export async function load() {
	try {
		const config = await import(`./config.md`);
		return {
			meta: config.metadata
		};
	} catch (e) {
		error(500, 'Cannot load site configuration');
	}
}
