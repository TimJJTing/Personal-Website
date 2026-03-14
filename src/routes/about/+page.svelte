<script>
	let { data } = $props();
	let Content = $derived(data.content);
	let title = $derived(data.meta.title);
</script>

<main>
	<section>
		<article>
			<h1>{title}</h1>
			<Content />
		</article>
	</section>
</main>
