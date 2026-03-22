<script>
	let { meta } = $props();
	let loading = $state(false);

	async function handleDownload() {
		loading = true;
		try {
			const { generateResumePdf } = await import('$lib/utils/generate-resume-pdf.js');
			generateResumePdf(meta);
		} finally {
			loading = false;
		}
	}
</script>

<button
	onclick={handleDownload}
	disabled={loading}
	class="group/btn inline-flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait"
>
	<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300 group-hover/btn:translate-y-0.5">
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="7 10 12 15 17 10" />
		<line x1="12" y1="15" x2="12" y2="3" />
	</svg>
	<span class="group-hover/btn:underline">{loading ? 'Generating...' : 'Download Resume'}</span>
</button>
