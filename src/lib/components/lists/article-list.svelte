<script>
	const { articles, orderBy = 'date', desc = true, tagFilter = [] } = $props();

	// import WorkPreview from './WorkPreview.svelte';

	// TODO: add filter feature
	// let filteredArticles = $derived( articles.filter(w => w.categories) )
	let filteredArticles = $derived(articles);

	// order articles by year desc
	let sortedArticles = $derived(
		filteredArticles?.sort((a, b) => {
			if (a[orderBy] > b[orderBy]) return desc ? -1 : 1;
			if (a[orderBy] < b[orderBy]) return desc ? 1 : -1;
			return 0;
		})
	);
</script>

<div class="articles-container">
	<div class="work-group">
		{#each sortedArticles as route, idx (idx)}
			<a href={route.path}>
				<h4 class="work-title">{route.title}</h4>
			</a>
			<!-- <WorkPreview
					path={route.path}
					title={route.title}
					media={route.media}
					images={route.images}
				/> -->
		{/each}
	</div>
</div>
