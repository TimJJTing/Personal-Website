<script>
	import Tag from './tag.svelte';
	/** @type {{tags: string[]} }*/
	let { tags = [] } = $props();
</script>

<div class="mt-4 mb-6 flex flex-wrap">
	{#each tags as tag, i (i)}
		<Tag title={tag}>{tag}</Tag>
	{/each}
</div>
