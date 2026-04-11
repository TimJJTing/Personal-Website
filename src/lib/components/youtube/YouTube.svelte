<script>
	let { url, width, height, autoplay = false, allowfullscreen = false } = $props();

	/**
	 * @param {string} videoUrl
	 * @returns {{id: string, isShort: boolean}}
	 */
	function getVideoInfo(videoUrl) {
		if (!videoUrl) return { id: '', isShort: false };
		let videoId = '';
		let isShort = false;
		try {
			// Handle YouTube Shorts URLs
			const shortsMatch = videoUrl.match(/youtube\.com\/shorts\/([^#&?]*)/);
			if (shortsMatch && shortsMatch[1]) {
				videoId = shortsMatch[1];
				isShort = true;
			} else {
				// Handle different YouTube URL formats
				const match = videoUrl.match(
					/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
				);
				if (match && match[2].length === 11) {
					videoId = match[2];
				}
			}
		} catch (e) {
			console.error('Error parsing YouTube URL:', videoUrl);
		}
		return { id: videoId, isShort };
	}

	let videoInfo = $derived(getVideoInfo(url));

	let embedSrc = $derived.by(() => {
		if (!videoInfo.id) return '';
		let src = `https://www.youtube.com/embed/${videoInfo.id}`;
		const params = [];
		if (autoplay) params.push('autoplay=1');
		if (params.length > 0) {
			src += '?' + params.join('&');
		}
		return src;
	});

	let isResponsive = $derived(!width && !height);
</script>

{#if embedSrc}
	{#if isResponsive}
		<div class="video-container" class:shorts={videoInfo.isShort}>
			<iframe
				src={embedSrc}
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				{allowfullscreen}
			></iframe>
		</div>
	{:else}
		<iframe
			{width}
			{height}
			src={embedSrc}
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			{allowfullscreen}
		></iframe>
	{/if}
{/if}

<style>
	.video-container {
		position: relative;
		padding-bottom: 56.25%; /* 16:9 */
		padding-top: 30px;
		height: 0;
		overflow: hidden;
		margin: 1.5em 0;
	}

	.video-container.shorts {
		padding-bottom: 177.78%; /* 9:16 */
		max-width: 360px;
		margin-left: auto;
		margin-right: auto;
	}

	.video-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}
</style>
