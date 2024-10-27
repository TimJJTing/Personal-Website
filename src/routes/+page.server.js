/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	const articleResponse = await fetch('api/articles');
	const workResponse = await fetch('api/works');
	const articles = await articleResponse.json();
	const works = await workResponse.json();
	return {
		articles,
		works
	};
}
