import { error, json } from '@sveltejs/kit';

async function getWorks() {
	try {
		const modules = Object.entries(import.meta.glob(`/src/routes/works/**/*.md`, { eager: true }));
		const works = modules
			.map(([file, module]) => {
				const path = file.replace('/src/routes/', '/').replace('index', '').replace('.md', '');
				return {
					path,
					...module?.metadata
				};
			})
			.filter((a) => a.published)
			.sort((first, second) => second.year - first.year);
		return works;
	} catch (e) {
		error(500, 'Cannot get articles');
	}
}

export async function GET() {
	const works = await getWorks();
	return json(works);
}
