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
	/** @type {{src: string, alt: string, sizes?: string, thumbnail?: boolean}}*/
	let {
		src,
		alt,
		sizes = '(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px',
		thumbnail = false
	} = $props();
	const image = getImage(src);
</script>

<figure class="image" class:thumbnail>
	<enhanced:img src={image} {alt} {sizes} />
</figure>

<style>
	.thumbnail {
		width: 128px;
	}
</style>
