<script>
	import { ItemList } from '$lib/components/item';
	let { data } = $props();
	let title = $derived(data.meta.title);
	let works = $derived(data.works);
	let articles = $derived(data.articles);
</script>

<header>
	<section class="my-8 md:my-16">
		<h1 class="text-5xl md:text-6xl font-bold">{title}</h1>
	</section>
</header>
<main>
	<section class="my-8 md:my-16">
		<ItemList items={works} title="Works" />
	</section>
	<section class="my-8 md:my-16">
		<ItemList items={articles} title="Blog" />
	</section>
</main>
