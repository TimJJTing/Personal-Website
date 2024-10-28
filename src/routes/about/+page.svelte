<script>
	let { data } = $props();
	let Content = data.content;
</script>

<main>
	<section>
		<h1>{data.meta.title}</h1>
		<article>
			<Content />
		</article>
	</section>
</main>
