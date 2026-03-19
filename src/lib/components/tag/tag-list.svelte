<script>
	import Tag from './tag.svelte';
	/** @type {{tags: string[]} }*/
	let { tags = [] } = $props();
</script>

<div class="flex flex-wrap mt-4 mb-6">
	{#each tags as tag, i (i)}
		<Tag title={tag}>{tag}</Tag>
	{/each}
</div>
