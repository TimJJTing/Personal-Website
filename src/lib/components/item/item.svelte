<script>
	import { EnhancedImg } from '../img';
	/** @type {Item} */
	let { title, path, description, thumbnail, additionalLinks, categories, year, date } = $props();
</script>

<div class="my-12 flex">
	<EnhancedImg src={thumbnail || '/uploads/favicon.png'} alt="An alt text" />
	<div class="grid-rows-auto ml-8 grid flex-grow">
		<div class="flex justify-between">
			<h3 class="mb-2 text-2xl font-medium truncate"><a href={path}>{title}</a></h3>
            <p class="mb-2 text-2xl font-light text-neutral-500">
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
		<div class="flex flex-row gap-2 self-end font-light text-neutral-400">
			<span><a href={path}>Read more...</a></span>
			{#if additionalLinks}
				{#each additionalLinks as { title, url } (url)}
					<span><a href={url}>{title}</a></span>
				{/each}
			{/if}
		</div>
	</div>
</div>
