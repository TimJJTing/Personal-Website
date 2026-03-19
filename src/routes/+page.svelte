<script>
	import { ItemList } from '$lib/components/item';
	let { data } = $props();
	let title = $derived(data.meta.title);
	let works = $derived(data.works);
	let articles = $derived(data.articles);
</script>

<header class="py-12 md:py-20">
	<h1 class="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-neutral-900 dark:text-neutral-100 leading-[0.95]">
		{title}
	</h1>
</header>
<main>
	<section class="mb-16 md:mb-24">
		<ItemList items={works} title="Works" />
	</section>
	<section class="mb-16 md:mb-24">
		<ItemList items={articles} title="Blog" />
	</section>
</main>
