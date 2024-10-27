<script>
	import { ArticleList } from '$lib/components/lists';
	let { data } = $props();
</script>

<h1>{data.meta.title}</h1>
<ArticleList articles={data.articles} />
