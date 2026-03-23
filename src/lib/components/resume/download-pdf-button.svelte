<script>
	import { isMobile } from '$lib/utils/device';

	let { meta } = $props();
	let filename = $derived(meta.title ? `${meta.title.replace(/\s+/g, '_')}_Resume` : 'Resume');

	/**
	 * @param { MouseEvent } event
	 */
	async function handleClick(event) {
		event.preventDefault();
		const url = `/about/${filename}.pdf`;
		const pdfFilename = `${filename}.pdf`;

		// Fetch the PDF as a File for both share and download paths
		const response = await fetch(url);
		const blob = await response.blob();
		const file = new File([blob], pdfFilename, { type: 'application/pdf' });

		// Check if Web Share API is available and supports file sharing
		if (isMobile() && navigator.share && navigator.canShare?.({ files: [file] })) {
			try {
				await navigator.share({ files: [file], title: pdfFilename });
				return;
			} catch (shareError) {
				// @ts-ignore (shareError as Error)
				if (shareError.name === 'AbortError') {
					// User cancelled
					return;
				}
				// Share failed, fall through to download
			}
		}

		// Fallback: standard download for desktop or when Web Share is unavailable
		const link = document.createElement('a');
		link.download = pdfFilename;
		link.href = URL.createObjectURL(blob);
		link.click();
		URL.revokeObjectURL(link.href);
	}
</script>

<a
	href="/about/{filename}.pdf"
	download="{filename}.pdf"
	onclick={handleClick}
	class="group/btn inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors duration-300 hover:text-neutral-900 hover:no-underline dark:text-neutral-400 dark:hover:text-neutral-100"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="transition-transform duration-300 group-hover/btn:translate-y-0.5"
	>
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="7 10 12 15 17 10" />
		<line x1="12" y1="15" x2="12" y2="3" />
	</svg>
	<span class="group-hover/btn:underline">Download Resume</span>
</a>
