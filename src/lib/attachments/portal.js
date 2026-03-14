/**
 * A Svelte 5 attachment factory that portals an element to a target node.
 *
 * Usage:
 * ```svelte
 * <div {@attach portal()}>...</div>
 * ```
 * or with a custom target:
 * ```svelte
 * <div {@attach portal(document.getElementById('modals'))}>...</div>
 * ```
 *
 * @param {HTMLElement} [target=document.body] - The target element to append the node to.
 * @returns {import('svelte/attachments').Attachment} - The attachment function.
 */
export function portal(target = document.body) {
	return (node) => {
		target.appendChild(node);
		return () => {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		};
	};
}
