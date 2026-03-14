<script>
	import { ItemList } from '$lib/components/item';
	let { data } = $props();
	let works = $derived(data.works);
	let title = $derived(data.meta.title);
</script>

<main>
	<section class="my-8">
		<ItemList items={works} {title} />
	</section>
</main>
