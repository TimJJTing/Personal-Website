<script>
	import ItemCard from './item.svelte';
	/** @type {{items: Item[], title: string}}*/
	let { items, title } = $props();

	// TODO: add filter feature
	let filteredItems = $derived(items);
</script>

{#if filteredItems.length > 0}
	<div class="flex items-baseline gap-4 mb-10 md:mb-14">
		<h2 class="text-3xl md:text-4xl font-extralight tracking-tight text-neutral-300 dark:text-neutral-700">
			{title}
		</h2>
		<div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-800"></div>
	</div>
	<div class="space-y-2">
		{#each filteredItems as item, idx (idx)}
			<div style="animation: fadeSlideUp 0.5s ease-out {idx * 0.08}s both">
				<ItemCard {...item} />
			</div>
		{/each}
	</div>
{/if}

<style>
	@keyframes fadeSlideUp {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
