<script>
	import { ItemList } from '#lib/components/item/index.js';
	let { data } = $props();
	let title = $derived(data.meta.title);
	let works = $derived(data.works);
	let articles = $derived(data.articles);
</script>

<header class="py-12 md:py-20">
	<h1
		class="text-5xl leading-[0.95] font-extralight tracking-tight text-neutral-900 md:text-7xl lg:text-8xl dark:text-neutral-100"
	>
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
