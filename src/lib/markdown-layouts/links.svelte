<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	/** @type {{ links: {title: string, url: string}[] }} */
	let { links = [] } = $props();
	let isRoot = $derived(page.url.pathname === '/');
	let isResume = $derived(page.url.pathname === '/about');
</script>

<ul
	class="my-4 flex flex-nowrap justify-between gap-4 text-xl font-medium text-neutral-300 sm:justify-end"
>
	{#if !isRoot}
		<li>
			<a href={resolve('/')}>
				<span> Home </span>
			</a>
		</li>
	{/if}
	{#if !isResume}
		<li><a href={resolve('about')}><span>Resume</span></a></li>
	{/if}
	{#each links as link (link.title)}
		<li>
			<a href={link.url} target="_blank" rel="external">
				<span>
					{link.title}
				</span>
			</a>
		</li>
	{/each}
</ul>
