<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { NetlifyEnhancedImg } from '#lib/components/img/index.js';
	/** @type {Item} */
	let { title, path, description, thumbnail, banner, additionalLinks, slides, year, date } =
		$props();

	// `path` is a site-absolute pathname such as `/works/foo`
	let pathname = $derived(/** @type {import('$app/types').Path} */ (path.slice(1)));

	function navigate() {
		goto(resolve(pathname));
	}

	/**
	 * @param {MouseEvent} e
	 */
	function handleCardClick(e) {
		// Don't navigate if clicking an inner link
		if (/** @type {HTMLElement} */ (e.target).closest('a')) return;
		navigate();
	}
</script>

<div
	class="item-card group -mx-4 block cursor-pointer rounded-sm px-4 py-6 transition-colors duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
	role="link"
	tabindex={0}
	onclick={handleCardClick}
	onkeydown={(e) => e.key === 'Enter' && navigate()}
>
	<div class="flex min-h-28">
		<div class="shrink-0">
			<NetlifyEnhancedImg
				src={thumbnail || banner || '/uploads/favicon.png'}
				alt={`${title} thumbnail`}
				thumbnail
				class="rounded-lg"
			/>
		</div>
		<div class="ml-6 flex min-w-0 grow flex-col md:ml-8 lg:ml-10">
			<div class="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
				<h3
					class="text-lg font-medium tracking-tight text-neutral-900 transition-colors duration-300 group-hover:text-neutral-700 md:text-xl dark:text-neutral-100 dark:group-hover:text-neutral-200"
				>
					<a href={resolve(pathname)} class="hover:no-underline">{title}</a>
				</h3>
				<span
					class="shrink-0 text-sm font-light text-neutral-400 tabular-nums dark:text-neutral-500"
				>
					{#if date}
						{new Date(date).toLocaleDateString()}
					{:else if year}
						{year}
					{/if}
				</span>
			</div>
			<p class="mt-2 line-clamp-2 text-sm! font-light text-neutral-500 dark:text-neutral-400">
				{description}
			</p>
			<div
				class="mt-auto flex flex-row flex-wrap gap-4 pt-3 text-sm font-light text-neutral-400 dark:text-neutral-500"
			>
				{#if slides}
					<span
						class="hidden transition-colors duration-200 hover:text-neutral-700 md:inline dark:hover:text-neutral-300"
						><a href={slides} target="_blank" rel="external">Slides</a></span
					>
				{/if}
				{#if additionalLinks}
					{#each additionalLinks as { title: linkTitle, url } (url)}
						<span
							class="hidden transition-colors duration-200 hover:text-neutral-700 md:inline dark:hover:text-neutral-300"
							><a href={url} target="_blank" rel="external">{linkTitle}</a></span
						>
					{/each}
				{/if}
				<span
					class="text-neutral-500 transition-colors duration-200 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200"
					>Read more →</span
				>
			</div>
		</div>
	</div>
</div>

<style>
	.item-card :global(a),
	.item-card :global(a:hover) {
		text-decoration: none;
	}
</style>
