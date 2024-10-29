<script>
	import { page } from '$app/stores';
	// let year = new Date().getFullYear();
	let isRoot = $derived($page.url.pathname === '/');
</script>

<footer class="my-16 flex w-full flex-col items-center justify-center font-light text-neutral-400">
	{#if !isRoot}
		<div class="my-8 h-px w-full bg-neutral-400"></div>
		<div
			onclick={() => window?.scrollTo(0, 0)}
			tabindex={0}
			onkeydown={(e) => e.key === 'Enter' && window?.scrollTo(0, 0)}
			role="button"
		>
			Back to top
		</div>
	{/if}
</footer>
