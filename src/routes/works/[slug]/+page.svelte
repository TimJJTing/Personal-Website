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
				fetchpriority="high"
				loading="eager"
			/>
			<h1>{data.meta.title}</h1>
			<Content />
			{#if data.meta.images}
				{#each data.meta.images as { image, caption }, i (i)}
					<EnhancedImg src={image} alt={caption} {caption} />
				{/each}
			{/if}
		</article>
	</section>
</main>
