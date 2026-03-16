import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load() {
	try {
		// @ts-expect-error TS can't resolve dynamic template literal imports for .md files
		const about = await import(`./about.md`);
		return {
			content: about.default,
			meta: about.metadata
		};
	} catch (e) {
		error(404, `Could not find about`);
	}
}
