import { join, dirname } from "path";
import { fileURLToPath } from "url";
import remarkFootnotes from "remark-footnotes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const path_to_layout = join(__dirname, "./src/lib/markdown-layouts");

const config = {
	extensions: ['.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},
	layout: {
		links: path_to_layout + '/links.svelte',
		article: path_to_layout + '/article.svelte',
		work: path_to_layout + '/work.svelte',
		_: path_to_layout + '/default.svelte'
	},
	remarkPlugins: [remarkFootnotes],
	rehypePlugins: []
};

export default config;
