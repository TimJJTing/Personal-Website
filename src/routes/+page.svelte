<script>
	import { ItemList } from '$lib/components/item';
	let { data } = $props();
</script>

<header>
	<section class="my-8 md:my-16">
		<h1 class="text-5xl md:text-6xl font-bold">{data.meta.title}</h1>
	</section>
</header>
<main>
	<section class="my-8 md:my-16">
		<ItemList items={data.works} title="Works" />
	</section>
	<section class="my-8 md:my-16">
		<ItemList items={data.articles} title="Blog" />
	</section>
</main>
