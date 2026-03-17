import {
	SITE_URL,
	getAboutMeta,
	getWorks,
	getArticles,
	formatDateRange,
	formatLinks
} from '$lib/data/content.js';

export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const [aboutMeta, works, articles] = await Promise.all([
		getAboutMeta(),
		getWorks({ includeBody: true }),
		getArticles({ includeBody: true })
	]);

	const experience = aboutMeta.experience?.content?.filter((/** @type {any} */ e) => e.publish) || [];
	const education = aboutMeta.education?.content?.filter((/** @type {any} */ e) => e.publish) || [];
	const skills = aboutMeta.skills?.content?.filter((/** @type {any} */ s) => s.publish) || [];
	const interests = aboutMeta.interests?.content?.filter((/** @type {any} */ i) => i.publish) || [];

	const lines = [
		'# Jie-Ting Jiang — Full Portfolio & Resume',
		'',
		`> This is the extended version of llms.txt for Jie-Ting Jiang's personal website (${SITE_URL}). It contains the full text of all portfolio works, articles, and professional background to provide maximum context for LLM-based analysis.`,
		'',
		'---',
		'',

		// Professional Summary
		'## Professional Summary',
		'',
		aboutMeta.summary,
		'',

		// Work Experience
		'## Work Experience',
		'',
		...experience.flatMap((/** @type {any} */ exp) => [
			`### ${exp.title}`,
			`**${exp.company}** — ${formatDateRange(exp)}, ${exp.location}`,
			'',
			...(exp.works || []).map((/** @type {string} */ w) => `- ${w}`),
			''
		]),

		// Education
		'## Education',
		'',
		...education.map((/** @type {any} */ edu) => {
			const startYear = edu.startTime ? new Date(edu.startTime).getFullYear() : '';
			const endYear = edu.endTime ? new Date(edu.endTime).getFullYear() : '';
			const worksStr = edu.works?.length ? ' ' + edu.works.join('. ') + '.' : '';
			return `- **${edu.title}** (${startYear}–${endYear}) — ${edu.institute}, ${edu.location}.${worksStr}`;
		}),
		'',

		// Technical Skills
		'## Technical Skills',
		'',
		...skills
			.filter((/** @type {any} */ s) => s.title !== 'Language Skills')
			.map((/** @type {any} */ s) => `- **${s.title}:** ${s.description}`),
		'',

		// Language Skills
		...(() => {
			const lang = skills.find((/** @type {any} */ s) => s.title === 'Language Skills');
			return lang ? ['## Language Skills', '', lang.description, ''] : [];
		})(),

		// Interests
		...(interests.length > 0
			? [
					'## Interests & Hobbies',
					'',
					interests.map((/** @type {any} */ i) => i.title).join(', '),
					''
				]
			: []),

		'---',
		'',

		// Selected Works — Full Descriptions
		'## Selected Works — Full Descriptions',
		'',
		...works.flatMap((w) => [
			`### ${w.title} (${w.year || ''})`,
			...(w.categories.length > 0 ? [`**Technologies:** ${w.categories.join(', ')}`] : []),
			...(w.additionalLinks.length > 0 ? [`**Links:** ${formatLinks(w.additionalLinks)}`] : []),
			'',
			w.body ?? '',
			'',
			'---',
			''
		]),

		// Articles & Talks — Full Descriptions
		'## Articles & Talks — Full Descriptions',
		'',
		...articles.flatMap((a) => {
			const year = a.date ? new Date(a.date).getFullYear() : '';
			const linkParts = [];
			if (a.slides) linkParts.push(`[Slides](${a.slides})`);
			if (a.additionalLinks.length > 0) linkParts.push(formatLinks(a.additionalLinks));
			return [
				`### ${a.title} (${year})`,
				...(linkParts.length > 0 ? [`**Links:** ${linkParts.join(' | ')}`] : []),
				'',
				a.body ?? '',
				'',
				'---',
				''
			];
		}),

		// Links
		'## Links',
		'',
		'- [LinkedIn](https://www.linkedin.com/in/jie-ting-jiang/)',
		'- [GitHub](https://github.com/TimJJTing)',
		`- [Website](${SITE_URL})`
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
