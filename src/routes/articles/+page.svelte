<script>
	import { ItemList } from '$lib/components/item';
	let { data } = $props();
	let articles = $derived(data.articles);
	let title = $derived(data.meta.title);
</script>

<main class="py-12 md:py-20">
	<section>
		<ItemList items={articles} {title} />
	</section>
</main>
