<script>
	/** @type {{ links: {title: string, url: string}[] }} */
	let { links } = $props();
</script>

<ul>
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
