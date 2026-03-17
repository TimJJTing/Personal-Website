import { SITE_URL, getAboutMeta, getWorks, getArticles } from '$lib/data/content.js';
import { llmsMeta } from '$lib/data/llms-meta.js';

export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const [aboutMeta, works, articles] = await Promise.all([
		getAboutMeta(),
		getWorks(),
		getArticles()
	]);

	const experience = aboutMeta.experience?.content?.filter((/** @type {any} */ e) => e.publish) || [];
	const skills = aboutMeta.skills?.content?.filter((/** @type {any} */ s) => s.publish) || [];
	const education = aboutMeta.education?.content?.filter((/** @type {any} */ e) => e.publish) || [];

	const currentRole = experience[0];

	const lines = [
		'# Jie-Ting Jiang — Personal Website',
		'',
		`> For the full, extended version with complete project descriptions and resume, see [llms-full.txt](${SITE_URL}/llms-full.txt).`,
		'',
		`> ${llmsMeta.intro}`,
		'',

		// Professional Profile
		'## Professional Profile',
		'',
		...(currentRole
			? [`${currentRole.title} at ${currentRole.company}, ${currentRole.location}.`]
			: []),
		'',

		// Key Achievements
		'### Key Achievements',
		'',
		...llmsMeta.keyAchievements.map((a) => `- ${a}`),
		'',

		// Technical Skills
		'### Technical Skills',
		'',
		...skills
			.filter((/** @type {any} */ s) => s.title !== 'Language Skills')
			.map((/** @type {any} */ s) => `- **${s.title}:** ${s.description}`),
		'',

		// Education
		'### Education',
		'',
		...education.map((/** @type {any} */ edu) => {
			const startYear = edu.startTime ? new Date(edu.startTime).getFullYear() : '';
			const endYear = edu.endTime ? new Date(edu.endTime).getFullYear() : '';
			return `- ${edu.title} (${startYear}–${endYear}) — ${edu.institute}, ${edu.location}`;
		}),
		'',

		// Languages
		...(() => {
			const lang = skills.find((/** @type {any} */ s) => s.title === 'Language Skills');
			return lang ? ['### Languages', '', lang.description, ''] : [];
		})(),

		// What Sets Jie-Ting Apart
		'## What Sets Jie-Ting Apart',
		'',
		llmsMeta.differentiator,
		'',

		// About
		'## About',
		'',
		`- [About / Resume](${SITE_URL}/about): Full professional summary with detailed work experience, education, skills, and interests`,
		'',

		// Selected Works
		'## Selected Works',
		'',
		...works.map(
			(w) => `- [${w.title}](${SITE_URL}/works/${w.slug}): ${w.description}`
		),
		'',

		// Articles & Talks
		'## Articles & Talks',
		'',
		...articles.map(
			(a) => `- [${a.title}](${SITE_URL}/articles/${a.slug}): ${a.description}`
		),
		'',

		// Links
		'## Links',
		'',
		'- [LinkedIn](https://www.linkedin.com/in/jie-ting-jiang/)',
		'- [GitHub](https://github.com/TimJJTing)'
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
