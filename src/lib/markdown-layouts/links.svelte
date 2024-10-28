<script>
	/** @type {{ links: {title: string, url: string}[] }} */
	let { links } = $props();
</script>

<ul class="my-4 flex flex-nowrap justify-end gap-4 font-medium text-xl text-neutral-300">
	<li>
		<a href="/about">
			<span>
				Resume
			</span>
		</a>
	</li>
	{#each links as link (link.title)}
		<li>
			<a href={link.url} target="_blank">
				<span>
					{link.title}
				</span>
			</a>
		</li>
	{/each}
</ul>
