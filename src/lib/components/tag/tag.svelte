<script>
	let { children, ...restProps } = $props();
</script>

<span class="mr-2 mt-2 rounded-full bg-neutral-600 px-4 py-1 md:mr-4 md:py-2" {...restProps}>
	{@render children()}
</span>
