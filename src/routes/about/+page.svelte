<script>
	let { data } = $props();
	let Content = data.content;
</script>

<main>
	<section>
		<article>
			<h1>{data.meta.title}</h1>
			<Content />
		</article>
	</section>
</main>
