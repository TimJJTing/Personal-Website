import adapter from '@sveltejs/adapter-netlify';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vitest/config';
import { autoImportInstagram } from './auto-import-instagram.js';
import { autoImportYouTube } from './auto-import-youtube.js';
import mdsvexConfig from './mdsvex.config.js';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', ...mdsvexConfig.extensions],
			preprocess: [autoImportInstagram, autoImportYouTube, vitePreprocess(), mdsvex(mdsvexConfig)],
			adapter: adapter({
				// if true, will create a Netlify Edge Function rather
				// than using standard Node-based functions
				edge: false,

				// if true, will split your app into multiple functions
				// instead of creating a single one for the entire app.
				// if `edge` is true, this option cannot be used
				split: false
			}),
			prerender: {
				crawl: true,
				entries: ['*'],
				handleHttpError: ({ path, message }) => {
					// Ignore Netlify Image CDN URLs during prerendering
					// These only work on Netlify's CDN, not locally
					if (path.startsWith('/.netlify/images')) {
						return;
					}
					// For other errors, throw as usual
					throw new Error(message);
				}
			}
		})
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
