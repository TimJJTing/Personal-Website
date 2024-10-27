<script>
	import { ArticleList } from '$lib/components/lists';
	import { WorkList } from '$lib/components/lists';
	let { data } = $props();
</script>

<WorkList works={data.works} />
<ArticleList articles={data.articles} />
