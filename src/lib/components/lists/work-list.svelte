<script>
	const { works, orderBy = 'year', desc = true, tagFilter = []} = $props();

	// import WorkPreview from './WorkPreview.svelte';

	// TODO: add filter feature
	// let filteredWorks = $derived( works.filter(w => w.categories) )
	let filteredWorks = $derived(works);

	// order works by year desc
	let sortedWorks = $derived(
		filteredWorks.sort((a, b) => {
			if (a[orderBy] > b[orderBy]) return desc ? -1 : 1;
			if (a[orderBy] < b[orderBy]) return desc ? 1 : -1;
			return 0;
		})
	);
</script>

<div class="works-container">
	<div class="work-group">
		{#each sortedWorks as route, idx (idx)}
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
