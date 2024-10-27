const config = {
	extensions: ['.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},
	layout: {
		links: './src/lib/markdown-layouts/links.svelte',
		_: './src/lib/markdown-layouts/default.svelte'
	},
	remarkPlugins: [],
	rehypePlugins: []
};

export default config;
