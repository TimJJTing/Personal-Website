<script>
	import { page } from '$app/state';
	import { Nav } from '#lib/components/nav/index.js';
	import { Footer } from '#lib/components/footer/index.js';
	import '../app.css';
	// @ts-expect-error TS can't resolve .md module imports in Svelte files
	import Links from './links.md';
	let { children, data: layoutData } = $props();
	//  if page has a title, use it, otherwise fallback to the site title
	let title = $derived(page.data?.meta?.title || layoutData.meta.title);
	//  if page has a description, use it, otherwise fallback to the site description
	let description = $derived(page.data?.meta?.description || layoutData.meta.description);

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Jie-Ting Jiang',
		url: 'https://jtingjiang.com',
		jobTitle: 'Senior Business Intelligence Engineer',
		worksFor: {
			'@type': 'Organization',
			name: 'Gogoro'
		},
		sameAs: ['https://www.linkedin.com/in/jie-ting-jiang/', 'https://github.com/TimJJTing'],
		knowsAbout: [
			'Data Visualization',
			'Frontend Engineering',
			'Three.js',
			'D3.js',
			'Svelte',
			'React',
			'Business Intelligence',
			'Geospatial Analysis'
		],
		alumniOf: [
			{
				'@type': 'CollegeOrUniversity',
				name: 'Johannes Kepler Universität Linz'
			},
			{
				'@type': 'CollegeOrUniversity',
				name: 'National Sun Yat-Sen University'
			}
		]
	});
</script>

<svelte:head>
	<title>{title}</title>
	<!--  Essential META Tags -->
	<meta name="description" content={description} />
	<link rel="canonical" href={page.url.toString()} />

	<!--  Open Graph META Tags -->
	<meta property="og:title" content={title} />
	<meta property="og:site_name" content={layoutData.meta.title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={page.url.toString()} />
	<meta property="og:type" content="website" />

	<!--  Twitter META Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />

	<!--  Structured Data (JSON-LD) -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static, trusted content -->
	{@html '<script type="application/ld+json">' + jsonLd + '</script>'}
</svelte:head>

<div
	id="root"
	class="relative container mx-auto h-full px-6 sm:px-8 md:px-12 lg:px-24 xl:px-48 2xl:px-64"
>
	<Nav>
		<Links />
	</Nav>

	{@render children()}

	<Footer />
</div>
