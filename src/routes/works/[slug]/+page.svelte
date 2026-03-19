<script>
	import { NetlifyEnhancedImg } from '$lib/components/img';
	import { TagList } from '$lib/components/tag';
	/**
	 * @typedef {Object} Props
	 * @property {import('./$types').PageData} data
	 */
	/** @type {Props} */
	let { data } = $props();
	let Content = $derived(data.content);
	let banner = $derived(data.meta.banner);
	let title = $derived(data.meta.title);
	let categories = $derived(data.meta.categories);
	let images = $derived(data.meta.images);
	let slides = $derived(data.meta.slides);
	let additionalLinks = $derived(data.meta.additionalLinks);
</script>

<main class="py-12 md:py-20">
	<section>
		<article>
			{#if banner}
				<NetlifyEnhancedImg src={banner} alt={`${title} banner`} loading="eager" />
			{/if}

			<h1 class="mt-8">{title}</h1>

			{#if categories}
				<TagList tags={categories} />
			{/if}
			<Content />
			{#if images}
				{#each images as { image, caption }, i (i)}
					<NetlifyEnhancedImg src={image} alt={caption} {caption} loading="lazy" />
				{/each}
			{/if}

			{#if slides}
				<h2>Slides</h2>
				<ul>
					<li>
						<a href={slides} target="_blank">See Slides...</a>
					</li>
				</ul>
			{/if}

			{#if additionalLinks}
				<h2>Further Reading</h2>
				<ul>
					{#each additionalLinks as { url, title: linkTitle }, i (i)}
						<li>
							<a href={url} target="_blank">{linkTitle}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</article>
	</section>
</main>
