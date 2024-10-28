<!-- Credit: https://github.com/sveltejs/kit/issues/11535#issuecomment-2207645048 -->
<script module>
	const images = import.meta.glob(
		['../../../assets/uploads/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}'],
		{
			eager: true,
			query: { enhanced: true }
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
	/** @type {{src: string, alt: string}}*/
	let { src, alt } = $props();
	const image = getImage(src);
</script>

<figure class="image">
	<enhanced:img src={image} {alt} />
</figure>
