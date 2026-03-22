import { error } from '@sveltejs/kit';
import { generateResumePdf } from '$lib/utils/resume/generate-pdf.js';

export const prerender = true;

function loadMeta() {
	const modules = import.meta.glob('/src/routes/about/about.md', { eager: true });
	const mod = /** @type {any} */ (Object.values(modules)[0]);
	if (!mod?.metadata) error(500, 'Failed to load resume metadata');
	return mod.metadata;
}

/** @param {string} title */
function buildFilename(title) {
	return title ? `${title.replace(/\s+/g, '_')}_Resume` : 'Resume';
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	const meta = loadMeta();
	return [{ filename: buildFilename(meta.title) }];
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const meta = loadMeta();
	const expectedFilename = buildFilename(meta.title);

	if (params.filename !== expectedFilename) {
		error(404, 'Not found');
	}

	const buffer = generateResumePdf(meta);

	return new Response(buffer, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${expectedFilename}.pdf"`
		}
	});
}
