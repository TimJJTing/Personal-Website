<script>
	import { EnhancedImg } from '$lib/components/img';
	let { data } = $props();
	let Content = data.content;
</script>

<main>
	<section>
		<article>
			<EnhancedImg
				src={data.meta.thumbnail || '/uploads/favicon.png'}
				alt={`${data.meta.title} thumbnail`}
			/>
			<h1>{data.meta.title}</h1>
			<Content />
		</article>
	</section>
</main>
