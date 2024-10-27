<script>
	let { data } = $props();
	let Content = data.content;
</script>

<article>
	<h1>{data.meta.title}</h1>
	<Content />
</article>
