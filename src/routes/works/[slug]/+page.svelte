<script>
	import { EnhancedImg } from '$lib/components/img';
	import { TagList } from '$lib/components/tag';
	let { data } = $props();
	let Content = data.content;
</script>

<main>
	<section>
		<article>
			{#if data.meta.banner}
				<EnhancedImg
					src={data.meta.banner}
					alt={`${data.meta.title} banner`}
					fetchpriority="high"
					loading="eager"
				/>
			{/if}

			<h1>{data.meta.title}</h1>

			{#if data.meta.categories}
				<TagList tags={data.meta.categories} />
			{/if}
			
			<Content />
			{#if data.meta.images}
				{#each data.meta.images as { image, caption }, i (i)}
					<EnhancedImg src={image} alt={caption} {caption} loading="lazy"/>
				{/each}
			{/if}

			{#if data.meta.additionalLinks}
				<h2>Further Reading</h2>
				<ul>
					{#each data.meta.additionalLinks as { url, title }, i (i)}
						<li>
							<a href={url} target="_blank">{title}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</article>
	</section>
</main>
