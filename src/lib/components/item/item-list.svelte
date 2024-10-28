<script>
	import Item from './item.svelte';
	/** @type {{items: Item[], title: string}}*/
	let { items, title } = $props();

	// TODO: add filter feature
	let filteredItems = $derived(items);
</script>

<h2 class="my-6 text-4xl font-bold">{title}</h2>
{#each filteredItems as item, idx (idx)}
	<Item {...item} />
{/each}
