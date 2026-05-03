import { visit } from "unist-util-visit";

const WIDTHS = [128, 400, 640, 1280];
const QUALITY = 85;

/**
 * Build a Netlify Image CDN URL.
 * @param {string} src
 * @param {number} width
 * @returns {string}
 */
function netlifyUrl(src, width) {
	return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&q=${QUALITY}`;
}

/**
 * Generate a srcset string for the given source.
 * @param {string} src
 * @returns {string}
 */
function generateSrcset(src) {
	return WIDTHS.map((w) => `${netlifyUrl(src, w)} ${w}w`).join(", ");
}

const SIZES =
	"(min-width:1920px) 1280px, (min-width:1280px) 960px, (min-width:1024px) 768px, (min-width:768px) 640px, 100vw";

/**
 * Rehype plugin that replaces inline `<img>` tags whose `src` starts with
 * `/uploads` with a `<figure>` containing a Netlify-CDN-optimised `<img>`.
 *
 * Images with any other `src` are left untouched.
 */
export function rehypeEnhancedImg() {
	return (/** @type {any} */ tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "img") return;

			const src = node.properties?.src;
			if (typeof src !== "string" || !src.startsWith("/uploads")) return;

			const alt = node.properties?.alt ?? "";

			// Build the enhanced <img> element
			/** @type {import('hast').Element} */
			const enhancedImg = {
				type: "element",
				tagName: "img",
				properties: {
					src: netlifyUrl(src, 640),
					srcset: generateSrcset(src),
					sizes: SIZES,
					alt,
					loading: "lazy",
					decoding: "async",
				},
				children: [],
			};

			// Build optional figcaption from alt text
			const figureChildren = [enhancedImg];
			if (alt) {
				figureChildren.push({
					type: "element",
					tagName: "figcaption",
					properties: { className: ["flex", "justify-center"] },
					children: [{ type: "text", value: alt }],
				});
			}

			// Wrap in <figure class="image py-2">
			/** @type {import('hast').Element} */
			const figure = {
				type: "element",
				tagName: "figure",
				properties: { className: ["image", "py-2", "mx-auto", "w-fit", "flex", "justify-center", "flex-col"] },
				children: figureChildren,
			};

			// If the <img> is the only child of a <p>, replace the <p>
			// entirely to avoid invalid <figure> inside <p> nesting.
			if (
				parent &&
				parent.tagName === "p" &&
				parent.children.length === 1
			) {
				parent.tagName = figure.tagName;
				parent.properties = figure.properties;
				parent.children = figure.children;
			} else if (parent && typeof index === "number") {
				// Otherwise splice the figure in place of the original img
				parent.children[index] = figure;
			}
		});
	};
}
