<script>
	let { children } = $props();
</script>

<nav>
	<section>
		{@render children?.()}
	</section>
</nav>
