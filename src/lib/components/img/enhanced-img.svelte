<!-- Credit: https://github.com/sveltejs/kit/issues/11535#issuecomment-2207645048 -->
<script module>
	const images = import.meta.glob(
		['../../../assets/uploads/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}'],
		{
			eager: true,
			query: { enhanced: true, w: '1280;640;400;128' }
		}
	);

	/**
	 *
	 * @param {string} querystring unique querystring for the image, in this project, it should begin with `'/upload'`
	 */
	const getImage = (querystring) => {
		querystring = '../../../assets' + querystring;
		return images[querystring].default;
	};
</script>

<script>
	/** @type {{
	 *   src: string,
	 *   alt: string,
	 *   sizes?: string,
	 *   thumbnail?: boolean,
	 *   caption?: string,
	 *   [key: string]: any
	 * }}
	 * */
	let {
		src,
		alt,
		caption,
		sizes = '(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px',
		thumbnail = false,
		...restProps
	} = $props();
	const image = getImage(src);
</script>

<figure class:thumbnail class="image py-2">
	<enhanced:img src={image} {alt} {sizes} {...restProps} />
	{#if caption}
		<figcaption class="flex justify-center">{caption}</figcaption>
	{/if}
</figure>

<style>
	.thumbnail {
		min-width: 128px;
		width: 128px;
		display: flex;
		justify-content: center;
		align-items: start;
	}
</style>
