import { error, json } from '@sveltejs/kit';

async function getArticles() {
	try {
		const modules = Object.entries(
			import.meta.glob('/src/routes/articles/**/*.md', { eager: true })
		);
		const articles = modules
			.map(([file, module]) => {
				const path = file.replace('/src/routes/', '/').replace('index', '').replace('.md', '');
				return {
					path,
					...module?.metadata
				};
			})
			.filter((a) => a.published)
			.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

		return articles;
	} catch (e) {
		error(500, 'Cannot get articles');
	}
}

export async function GET() {
	const posts = await getArticles();
	return json(posts);
}
