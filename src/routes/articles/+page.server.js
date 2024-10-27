/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	const response = await fetch('api/articles');
	const articles = await response.json();
	return {
		articles,
		meta: {
			title: 'My articles'
		}
	};
}
