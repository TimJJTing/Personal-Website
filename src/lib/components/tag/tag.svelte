<script>
	let { children, ...restProps } = $props();
</script>

<span class="inline-block mr-1.5 mt-1.5 px-3 py-1.5 text-sm font-light rounded-sm bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/40" {...restProps}>
	{@render children()}
</span>
