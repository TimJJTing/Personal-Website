<script>
	import { ItemList } from '$lib/components/item';
	let { data } = $props();
	let works = $derived(data.works);
	let title = $derived(data.meta.title);
</script>

<main class="py-12 md:py-20">
	<section>
		<ItemList items={works} {title} />
	</section>
</main>
