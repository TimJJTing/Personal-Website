const config = {
	extensions: ['.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},
	layout: {
		links: './src/lib/markdown-layouts/links.svelte',
		article: './src/lib/markdown-layouts/article.svelte',
		work: './src/lib/markdown-layouts/work.svelte',
		_: './src/lib/markdown-layouts/default.svelte'
	},
	remarkPlugins: [],
	rehypePlugins: []
};

export default config;
