import { error, json } from '@sveltejs/kit';

async function getWorks() {
	try {
		const modules = Object.entries(import.meta.glob(`/src/routes/works/**/*.md`, { eager: true }));
		const works = modules
			.map(([file, module]) => {
				const { metadata } = /** @type {{ metadata: ItemMetadata }} */ (module);
				const path = file.replace('/src/routes/', '/').replace('index', '').replace('.md', '');
				return {
					path,
					...metadata
				};
			})
			.filter((a) => a.published)
			.sort((first, second) => Number(second.year ?? 0) - Number(first.year ?? 0));
		return works;
	} catch (e) {
		error(500, 'Cannot get articles');
	}
}

export async function GET() {
	const works = await getWorks();
	return json(works);
}
