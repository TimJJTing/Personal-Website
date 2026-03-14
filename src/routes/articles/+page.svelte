<script>
	import { ItemList } from '$lib/components/item';
	let { data } = $props();
	let articles = $derived(data.articles);
	let title = $derived(data.meta.title);
</script>

<main>
	<section class="my-8">
		<ItemList items={articles} {title} />
	</section>
</main>
