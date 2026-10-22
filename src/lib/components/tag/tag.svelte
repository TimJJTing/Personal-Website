<script>
	let { children, ...restProps } = $props();
</script>

<span
	class="mt-1.5 mr-1.5 inline-block rounded-sm border border-neutral-200/60 bg-neutral-100 px-3 py-1.5 text-sm font-light text-neutral-700 dark:border-neutral-700/40 dark:bg-neutral-800/80 dark:text-neutral-300"
	{...restProps}
>
	{@render children()}
</span>
