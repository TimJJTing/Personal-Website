/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const work = await import(`../${params.slug}.md`);
	return {
		content: work.default,
		meta: work.metadata
	};
}
