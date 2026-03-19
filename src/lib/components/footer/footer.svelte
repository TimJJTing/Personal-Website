<script>
	import { page } from '$app/stores';
	// let year = new Date().getFullYear();
	let isRoot = $derived($page.url.pathname === '/');
</script>

<footer class="my-16 flex w-full flex-col items-center justify-center font-light text-neutral-400 dark:text-neutral-500">
	{#if !isRoot}
		<div class="my-8 h-px w-full bg-neutral-200 dark:bg-neutral-800"></div>
		<div
			class="text-sm tracking-wide uppercase cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-300"
			onclick={() => window?.scrollTo({ top: 0, behavior: 'smooth' })}
			tabindex={0}
			onkeydown={(e) => e.key === 'Enter' && window?.scrollTo({ top: 0, behavior: 'smooth' })}
			role="button"
		>
			Back to top
		</div>
	{/if}
</footer>
