<!-- 
  NetlifyEnhancedImg - Uses Netlify Image CDN for runtime image optimization
-->
<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} src - The source path of the image. Should be a path like '/uploads/image.jpg'.
	 * @property {string} alt - Alternative text for the image.
	 * @property {string} [caption] - Optional caption text to display below the image.
	 * @property {string} [sizes] - The `sizes` attribute for responsive images. Defaults to standard breakpoints.
	 * @property {number} [quality] - Image quality (1-100). Defaults to 85. Only applies to lossy formats (webp, avif, jpg, gif).
	 * @property {boolean} [thumbnail] - If `true`, applies thumbnail styling. Defaults to `false`.
	 * @property {boolean} [disablePadding] - If `true`, removes the default vertical padding. Defaults to `false`.
	 * @property {number} [width] - The intrinsic width of the image in pixels. Used for aspect-ratio to prevent CLS.
	 * @property {number} [height] - The intrinsic height of the image in pixels. Used for aspect-ratio to prevent CLS.
	 * @property {any} [key] - Additional attributes passed to the underlying image element.
	 */

	/** @type {Props} */
	let {
		src,
		alt,
		caption,
		sizes = '(min-width:1920px) 1280px, (min-width:1280px) 960px, (min-width:1024px) 768px, (min-width:768px) 640px, 100vw',
		quality = 85,
		thumbnail = false,
		disablePadding = false,
		width = undefined,
		height = undefined,
		...restProps
	} = $props();

	// Generate aspect-ratio style when dimensions are provided
	let aspectRatioStyle = $derived(
		width && height ? `aspect-ratio: ${width} / ${height};` : undefined
	);

	const widths = [128, 400, 640, 1280];

	/**
	 * Construct a Netlify Image CDN URL
	 * @param {string} imageSrc - The source path
	 * @param {number} width - Target width in pixels
	 * @returns {string} - The CDN URL
	 */
	function getNetlifyImageUrl(imageSrc, width) {
		// Handle paths that start with /uploads - these are stored in static
		if (imageSrc.startsWith('/uploads')) {
			// Format is handled automatically via browser Accept header content negotiation:
			// webp if accepted -> avif if accepted -> original format
			return `/.netlify/images?url=${encodeURIComponent(imageSrc)}&w=${width}&q=${quality}`;
		}
		return imageSrc;
	}

	/**
	 * Generate srcset for responsive images
	 * @param {string} imageSrc - The source path
	 * @returns {string} - The srcset attribute value
	 */
	function generateSrcset(imageSrc) {
		return widths.map((w) => `${getNetlifyImageUrl(imageSrc, w)} ${w}w`).join(', ');
	}
</script>

<figure
	class:thumbnail
	class="image"
	class:py-2={!disablePadding}
	class:m-0={disablePadding}
	class:h-full={disablePadding}
	class:w-full={disablePadding}
	class:relative={disablePadding}
>
	<img
		src={getNetlifyImageUrl(src, 640)}
		srcset={generateSrcset(src)}
		{alt}
		{sizes}
		{width}
		{height}
		style={aspectRatioStyle}
		loading="lazy"
		decoding="async"
		{...restProps}
	/>
	{#if caption}
		<figcaption class="flex justify-center">{caption}</figcaption>
	{/if}
</figure>

<style>
	.image {
		margin-left: auto;
		margin-right: auto;
	}

	.image:not(.thumbnail) img {
		width: 100%;
		height: auto;
	}

	.thumbnail {
		min-width: 128px;
		width: 128px;
		display: flex;
		justify-content: center;
		align-items: start;
	}
</style>
