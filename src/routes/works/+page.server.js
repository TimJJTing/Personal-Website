/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	const response = await fetch('api/works');
	const works = await response.json();
	return {
		works,
		meta: {
			title: 'My works'
		}
	};
}
