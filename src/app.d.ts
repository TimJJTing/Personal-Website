// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	/** Markdown frontmatter metadata for articles and works */
	interface ItemMetadata {
		title: string;
		description: string;
		published: boolean;
		thumbnail?: string;
		banner?: string;
		additionalLinks?: { title: string; url: string }[];
		slides?: string;
		categories?: string[];
		year?: string | number;
		date?: string | Date;
		[key: string]: unknown;
	}

	/** Item with computed `path`, used for rendering in lists */
	interface Item extends ItemMetadata {
		path: string;
	}
}

declare module '*.md' {
	import type { Component } from 'svelte';
	const component: Component;
	export const metadata: ItemMetadata;
	export default component;
}

export {};
