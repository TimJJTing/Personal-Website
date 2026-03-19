<script>
	import { NetlifyEnhancedImg } from '$lib/components/img';
	/** @type {Item} */
	let {
		title,
		path,
		description,
		thumbnail,
		banner,
		additionalLinks,
		slides,
		categories,
		year,
		date
	} = $props();
</script>

<a href={path} class="item-card group block py-6 -mx-4 px-4 rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors duration-300">
	<div class="flex min-h-28">
		<div class="shrink-0">
			<NetlifyEnhancedImg
				src={thumbnail || banner || '/uploads/favicon.png'}
				alt={`${title} thumbnail`}
				thumbnail
				class="rounded-lg"
			/>
		</div>
		<div class="ml-6 md:ml-8 lg:ml-10 flex flex-col grow min-w-0">
			<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
				<h3 class="text-lg md:text-xl font-medium text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-300">
					{title}
				</h3>
				<span class="text-sm font-light text-neutral-400 dark:text-neutral-500 tabular-nums shrink-0">
					{#if date}
						{new Date(date).toLocaleDateString()}
					{:else if year}
						{year}
					{/if}
				</span>
			</div>
			<p class="!text-sm mt-2 text-neutral-500 dark:text-neutral-400 font-light line-clamp-2">{description}</p>
			<div class="flex flex-row flex-wrap gap-4 mt-auto pt-3 text-sm font-light text-neutral-400 dark:text-neutral-500">
				{#if slides}
					<span class="hidden md:inline hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200"><a href={slides} target="_blank" onclick={(e) => e.stopPropagation()}>Slides</a></span>
				{/if}
				{#if additionalLinks}
					{#each additionalLinks as { title: linkTitle, url }, i (url)}
						<span class="hidden md:inline hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200"><a href={url} target="_blank" onclick={(e) => e.stopPropagation()}>{linkTitle}</a></span>
					{/each}
				{/if}
				<span class="text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-200">Read more →</span>
			</div>
		</div>
	</div>
</a>

<style>
	.item-card,
	.item-card:hover,
	.item-card :global(a),
	.item-card :global(a:hover) {
		text-decoration: none;
	}
</style>
