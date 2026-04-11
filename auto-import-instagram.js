export const autoImportInstagram = {
	name: 'auto-import-instagram',
	markup({ content, filename }) {
		if (!filename) return;
		const isMarkdown = /(\.md|\.svx|\.svelte\.md)$/.test(filename);
		if (!isMarkdown) return;
		if (!content.includes('<Instagram')) return;

		const scriptRegex = /<script((?:\s+[^>]*?)?)>([\s\S]*?)<\/script>/gi;
		let instanceScriptMatch = null;
		let match;

		// Find the first instance script (not context="module")
		while ((match = scriptRegex.exec(content)) !== null) {
			const attrs = match[1];
			if (!attrs.includes('context="module"')) {
				instanceScriptMatch = match;
				break;
			}
		}

		if (instanceScriptMatch) {
			const [fullMatch, attrs, innerContent] = instanceScriptMatch;
			// Inject import at the top of the existing script
			const newScript = `<script${attrs}>\n\timport { Instagram } from '$lib/components';${innerContent}</script>`;
			return {
				code: content.replace(fullMatch, newScript)
			};
		} else {
			// No instance script found, create one
			// Check for frontmatter
			const frontmatterRegex = /^---\r?\n([\s\S]+?)\r?\n---/;
			const match = content.match(frontmatterRegex);

			if (match) {
				// Insert after frontmatter
				const frontmatterEnd = match[0].length;
				const before = content.slice(0, frontmatterEnd);
				const after = content.slice(frontmatterEnd);
				return {
					code: `${before}\n<script>\n\timport { Instagram } from '$lib/components';\n</script>\n${after}`
				};
			} else {
				// No frontmatter, insert at top
				return {
					code: `<script>\n\timport { Instagram } from '$lib/components';\n</script>\n${content}`
				};
			}
		}
	}
};
