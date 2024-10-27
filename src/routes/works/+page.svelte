<script>
	import { WorkList } from '$lib/components/lists';
	let { data } = $props();
</script>

<h1>{data.meta.title}</h1>
<WorkList works={data.works} />
