<script>
	import { page } from '$app/stores';
	import { Nav } from '$lib/components/nav';
	import { Footer } from '$lib/components/footer';
	import '../app.css';
	import Links from './links.md';
	let { children, data: layoutData } = $props();
	//  if page has a title, use it, otherwise fallback to the site title
	let title = $derived($page.data?.meta?.title || layoutData.meta.title);
	//  if page has a description, use it, otherwise fallback to the site description
	let description = $derived($page.data?.meta?.description || layoutData.meta.description);
</script>

<svelte:head>
	<title>{title}</title>
	<!--  Essential META Tags -->
	<meta name="description" content={description} />

	<!--  Open Graph META Tags -->
	<meta property="og:title" content={title} />
	<meta property="og:site_name" content={layoutData.meta.title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={$page.url.toString()} />
	<meta property="og:type" content="website" />

	<!--  Twitter META Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
</svelte:head>

<div
	id="root"
	class="container relative mx-auto h-full sm:px-8 md:px-12 lg:px-24 xl:px-48 2xl:px-64"
>
	<Nav>
		<Links />
	</Nav>

	{@render children()}

	<Footer />
</div>
