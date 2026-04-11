<script>
	import { onMount } from 'svelte';

	let { url, captioned = true } = $props();

	onMount(() => {
		if (window.instgrm) {
			window.instgrm.Embeds.process();
		} else if (!document.querySelector('script[src*="//www.instagram.com/embed.js"]')) {
			const script = document.createElement('script');
			script.src = '//www.instagram.com/embed.js';
			script.async = true;
			script.onload = () => {
				window.instgrm.Embeds.process();
			};
			document.body.appendChild(script);
		}
	});
</script>

<blockquote
	class="instagram-media"
	data-instgrm-captioned={captioned ? '' : undefined}
	data-instgrm-permalink={url}
	data-instgrm-version="14"
	style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"
></blockquote>
