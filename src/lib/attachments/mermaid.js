/** @type {Promise<typeof import('mermaid').default> | undefined} */
let mermaidPromise;

function loadMermaid() {
	mermaidPromise ??= import('mermaid')
		.then(({ default: mermaid }) => {
			mermaid.initialize({ startOnLoad: false, theme: 'dark' });
			return mermaid;
		})
		.catch((error) => {
			// Allow a later attachment to retry a failed load.
			mermaidPromise = undefined;
			throw error;
		});
	return mermaidPromise;
}

/**
 * A Svelte 5 attachment factory that renders every `<pre class="mermaid">` block
 * inside the node. mdsvex emits those blocks as raw diagram source, so without
 * this they show up as plain text. Mermaid is loaded lazily on the client.
 *
 * Usage:
 * ```svelte
 * <div {@attach mermaid()}>...</div>
 * ```
 *
 * @returns {import('svelte/attachments').Attachment} - The attachment function.
 */
export function mermaid() {
	return (node) => {
		const nodes = /** @type {HTMLElement[]} */ ([
			...node.querySelectorAll('pre.mermaid:not([data-processed])')
		]);
		if (nodes.length === 0) return;

		// Mermaid parses innerHTML, which still holds Svelte's `{@html}` hydration
		// comments (`<!---->`) and breaks diagram detection. Keep only the source.
		for (const el of nodes) el.textContent = el.textContent ?? '';

		let disposed = false;
		loadMermaid()
			.then((mermaid) => {
				if (disposed) return;
				return mermaid.run({ nodes });
			})
			.catch((error) => {
				if (!disposed) console.error('Mermaid render failed', error);
			});

		return () => {
			disposed = true;
		};
	};
}
