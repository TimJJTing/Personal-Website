<script>
	import { EnhancedImg } from '$lib/components/img';
	/** @type {Item} */
	let { title, path, description, thumbnail, additionalLinks, categories, year, date } = $props();
</script>

<div class="my-12 flex min-h-32">
	<EnhancedImg
		src={thumbnail || '/uploads/favicon.png'}
		alt={`${title} thumbnail`}
		thumbnail
		class="rounded-xl"
	/>
	<div class="grid-rows-auto ml-6 grid flex-grow md:ml-8 lg:ml-12">
		<div class="flex flex-col md:flex-row md:justify-between">
			<h3 class="mb-2 truncate text-2xl font-medium"><a href={path}>{title}</a></h3>
			<p class="text-sm font-light text-neutral-500 md:mb-2 md:text-2xl">
				{#if date}
					{new Date(date).toLocaleDateString()}
				{:else if year}
					{year}
				{/if}
			</p>
		</div>
		<!-- {#if categories}
			<div class="flex flex-row gap-2">
				{#each categories as category (category)}
					<span><a href="/?category={category}">{category}</a></span>
				{/each}
			</div>
		{/if} -->
		<p class="truncate">{description}</p>
		<div class="flex flex-row gap-4 self-end font-light text-neutral-400">
			<span><a href={path}>Read more...</a></span>
			{#if additionalLinks}
				{#each additionalLinks as { title, url }, i (url)}
					<span class="hidden md:inline"><a href={url}>{title}</a></span>
				{/each}
			{/if}
		</div>
	</div>
</div>
