import { join, dirname } from "path";
import { fileURLToPath } from "url";
import remarkFootnotes from "remark-footnotes";
import { escapeSvelte } from "mdsvex";
import { createHighlighter } from "shiki";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const path_to_layout = join(__dirname, "./src/lib/markdown-layouts");

// Initialize Shiki highlighter singleton (top-level await)
const shikiHighlighter = await createHighlighter({
	themes: ["github-dark", "github-light"],
	langs: ["javascript", "typescript", "tsx", "python", "yaml", "shellscript", "text"],
});

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
	rehypePlugins: [],
	highlight: {
		highlighter: async (code, lang = "text") => {
			// Skip mermaid blocks — let downstream renderers handle them
			if (lang === "mermaid") {
				return `<pre class="mermaid">{@html \`${escapeSvelte(code)}\`}</pre>`;
			}

			// Resolve language: fall back to 'text' for unsupported languages
			const loadedLangs = shikiHighlighter.getLoadedLanguages();
			const resolvedLang = loadedLangs.includes(lang) ? lang : "text";

			const html = escapeSvelte(
				shikiHighlighter.codeToHtml(code, {
					lang: resolvedLang,
					themes: {
						dark: "github-dark",
						light: "github-light",
					},
					defaultColor: false,
				})
			);
			return `{@html \`${html}\`}`;
		},
	},
};

export default config;
