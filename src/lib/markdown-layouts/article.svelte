<script>
	import { mermaid } from '#lib/attachments/mermaid.js';
	const { children } = $props();
</script>

<div style="display: contents" {@attach mermaid()}>
	{@render children()}
</div>
