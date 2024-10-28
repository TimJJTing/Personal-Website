<script>
	import { ItemList } from '$lib/components/item';
	let { data } = $props();
</script>

<main>
	<section class="my-8">
		<ItemList items={data.articles} title={data.meta.title} />
	</section>
</main>
