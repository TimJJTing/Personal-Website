import { jsPDF } from 'jspdf';
import { formatDateRange, formatYearRange, published } from './helpers.js';
import {
	COLOR,
	FONT_RATIO,
	HEADER,
	SECTION,
	ENTRY,
	PROJECT_GROUP,
	EDUCATION,
	LABELED,
	LINE_HEIGHT,
	PAGE,
	BASE_FONT_SIZE
} from './consts.js';

/**
 * Shared drawing context passed to section renderers.
 * @typedef {object} PdfContext
 * @property {import('jspdf').jsPDF} doc
 * @property {number} y
 * @property {number} baseFontSize
 * @property {number} marginLeft
 * @property {number} marginRight
 * @property {number} pageWidth
 * @property {number} contentWidth
 * @property {(ratio: number) => number} sz
 */

/**
 * Draw a section header with a horizontal rule.
 * @param {PdfContext} ctx
 * @param {string} title
 */
function drawSectionHeader(ctx, title) {
	ctx.y += SECTION.SPACE_ABOVE;
	ctx.doc.setFont('helvetica', 'bold');
	ctx.doc.setFontSize(ctx.sz(FONT_RATIO.SECTION_HEADER));
	ctx.doc.setTextColor(...COLOR.BLACK);
	ctx.doc.text(title, ctx.marginLeft, ctx.y);
	ctx.y += SECTION.RULE_GAP;
	ctx.doc.setDrawColor(0, 0, 0);
	ctx.doc.setLineWidth(0.3);
	ctx.doc.line(ctx.marginLeft, ctx.y, ctx.pageWidth - ctx.marginRight, ctx.y);
	ctx.y += SECTION.SPACE_BELOW;
}

/**
 * Draw wrapped text and advance y.
 * @param {PdfContext} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} maxWidth
 * @param {object} [opts]
 * @param {'normal'|'bold'|'italic'|'bolditalic'} [opts.fontStyle]
 * @param {number} [opts.fontSize]
 * @param {[number, number, number]} [opts.color]
 * @param {number} [opts.lineHeight]
 */
function drawText(ctx, text, x, maxWidth, opts = {}) {
	const {
		fontStyle = 'normal',
		fontSize = ctx.baseFontSize,
		color = COLOR.DARK_GRAY,
		lineHeight = LINE_HEIGHT
	} = opts;
	ctx.doc.setFont('helvetica', fontStyle);
	ctx.doc.setFontSize(fontSize);
	ctx.doc.setTextColor(...color);
	const lines = ctx.doc.splitTextToSize(text, maxWidth);
	const lh = (fontSize * lineHeight * 25.4) / 72; // pt to mm
	for (const line of lines) {
		ctx.doc.text(line, x, ctx.y);
		ctx.y += lh;
	}
}

/**
 * Draw a bullet point item.
 * @param {PdfContext} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} maxWidth
 */
function drawBullet(ctx, text, x, maxWidth) {
	const bulletIndent = 4;
	ctx.doc.setFillColor(...COLOR.DARK_GRAY);
	ctx.doc.circle(x + 1.2, ctx.y - 0.8, 0.6, 'F');
	drawText(ctx, text, x + bulletIndent, maxWidth - bulletIndent, {
		fontSize: ctx.baseFontSize,
		color: COLOR.DARK_GRAY
	});
	ctx.y += ENTRY.BULLET_GAP;
}

/**
 * Draw right-aligned text.
 * @param {PdfContext} ctx
 * @param {string} text
 * @param {number} atY
 * @param {object} [opts]
 * @param {'normal'|'bold'} [opts.fontStyle]
 * @param {number} [opts.fontSize]
 * @param {[number, number, number]} [opts.color]
 */
function drawRightText(ctx, text, atY, opts = {}) {
	const { fontStyle = 'normal', fontSize = ctx.baseFontSize, color = COLOR.DARK_GRAY } = opts;
	ctx.doc.setFont('helvetica', fontStyle);
	ctx.doc.setFontSize(fontSize);
	ctx.doc.setTextColor(...color);
	ctx.doc.text(text, ctx.pageWidth - ctx.marginRight, atY, { align: 'right' });
}

/**
 * Draw a bold label followed by wrapped normal-weight text on the same line.
 * Used by Skills and Interests sections.
 * @param {PdfContext} ctx
 * @param {string} label
 * @param {string} value
 */
function drawLabeledLine(ctx, label, value) {
	ctx.doc.setFont('helvetica', 'bold');
	ctx.doc.setFontSize(ctx.baseFontSize);
	ctx.doc.setTextColor(...COLOR.BLACK);
	const labelWidth = ctx.doc.getTextWidth(label);
	ctx.doc.text(label, ctx.marginLeft, ctx.y);

	ctx.doc.setFont('helvetica', 'normal');
	ctx.doc.setTextColor(...COLOR.DARK_GRAY);
	const descLines = ctx.doc.splitTextToSize(value, ctx.contentWidth - labelWidth);
	ctx.doc.text(descLines[0], ctx.marginLeft + labelWidth, ctx.y);
	ctx.y += LABELED.LINE_HEIGHT;
	if (descLines.length > 1) {
		const remainingText = descLines.slice(1).join(' ');
		const rewrapped = ctx.doc.splitTextToSize(remainingText, ctx.contentWidth);
		for (const line of rewrapped) {
			ctx.doc.text(line, ctx.marginLeft, ctx.y);
			ctx.y += LABELED.LINE_HEIGHT;
		}
	}
}

// ── Section renderers ──

/**
 * @param {PdfContext} ctx
 * @param {Record<string, any>} meta
 */
function renderHeader(ctx, meta) {
	ctx.doc.setFont('helvetica', 'bold');
	ctx.doc.setFontSize(ctx.sz(FONT_RATIO.NAME));
	ctx.doc.setTextColor(...COLOR.BLACK);
	ctx.doc.text(meta.title, ctx.marginLeft, ctx.y + HEADER.BASELINE_OFFSET);
	ctx.y += HEADER.BLOCK_HEIGHT;

	const contactParts = [];
	if (meta.email) contactParts.push(meta.email);
	if (meta.website) contactParts.push(meta.website);
	if (meta.github) contactParts.push(meta.github);

	if (contactParts.length) {
		ctx.doc.setFont('helvetica', 'normal');
		ctx.doc.setFontSize(ctx.sz(FONT_RATIO.CONTACT));
		ctx.doc.setTextColor(...COLOR.TEAL);
		const separator = '  \u2022  ';
		const contactLine = contactParts.join(separator);
		ctx.doc.text(contactLine, ctx.marginLeft, ctx.y);

		let linkX = ctx.marginLeft;
		for (let i = 0; i < contactParts.length; i++) {
			const part = contactParts[i];
			const partWidth = ctx.doc.getTextWidth(part);
			const url = part.includes('@')
				? `mailto:${part}`
				: part.startsWith('http')
					? part
					: `https://${part}`;
			ctx.doc.link(linkX, ctx.y - 3, partWidth, 4, { url });
			if (i < contactParts.length - 1) {
				linkX += partWidth + ctx.doc.getTextWidth(separator);
			}
		}
		ctx.y += HEADER.CONTACT_HEIGHT;
	}
}

/**
 * @param {PdfContext} ctx
 * @param {Record<string, any>} meta
 */
function renderSummary(ctx, meta) {
	if (!meta.summary) return;
	drawSectionHeader(ctx, 'Summary');
	drawText(ctx, meta.summary, ctx.marginLeft, ctx.contentWidth);
}

/**
 * @param {PdfContext} ctx
 * @param {Record<string, any>} meta
 */
function renderExperience(ctx, meta) {
	if (!meta.experience?.publish || !meta.experience.content?.length) return;
	drawSectionHeader(ctx, 'Experience');
	const jobs = published(meta.experience.content);

	const pdfDateOpts = { separator: ' - ', monthFormat: /** @type {const} */ ('long') };

	let isFirst = true;
	for (const job of jobs) {
		if (!isFirst) ctx.y += ENTRY.JOB_GAP;
		isFirst = false;

		const titleY = ctx.y;
		ctx.doc.setFont('helvetica', 'bold');
		ctx.doc.setFontSize(ctx.sz(FONT_RATIO.ENTRY_TITLE));
		ctx.doc.setTextColor(...COLOR.BLACK);
		ctx.doc.text(job.title, ctx.marginLeft, ctx.y);

		drawRightText(ctx, formatDateRange(job.startTime, job.endTime, pdfDateOpts), titleY);
		ctx.y += ENTRY.TITLE_TO_SUBTITLE;

		const companyY = ctx.y;
		ctx.doc.setFont('helvetica', 'normal');
		ctx.doc.setFontSize(ctx.baseFontSize);
		ctx.doc.setTextColor(...COLOR.DARK_GRAY);
		ctx.doc.text(job.company, ctx.marginLeft, ctx.y);

		drawRightText(ctx, job.location, companyY);
		ctx.y += ENTRY.SUBTITLE_TO_CONTENT;

		if (job.works?.length) {
			for (const work of job.works) {
				drawBullet(ctx, work, ctx.marginLeft + 2, ctx.contentWidth - 2);
			}
		}

		if (job.projectGroups?.length) {
			let isFirstGroup = true;
			for (const group of job.projectGroups) {
				if (!isFirstGroup) ctx.y += PROJECT_GROUP.GAP;
				isFirstGroup = false;

				ctx.doc.setFont('helvetica', 'bold');
				ctx.doc.setFontSize(ctx.baseFontSize);
				ctx.doc.setTextColor(...COLOR.BLACK);
				ctx.doc.text(group.name, ctx.marginLeft, ctx.y);
				ctx.y += PROJECT_GROUP.NAME_GAP;

				if (group.works?.length) {
					for (const work of group.works) {
						drawBullet(ctx, work, ctx.marginLeft + 2, ctx.contentWidth - 2);
					}
				}
			}
		}
	}
}

/**
 * @param {PdfContext} ctx
 * @param {Record<string, any>} meta
 */
function renderEducation(ctx, meta) {
	if (!meta.education?.publish || !meta.education.content?.length) return;
	drawSectionHeader(ctx, 'Education');
	const edus = published(meta.education.content);

	const pdfYearOpts = { separator: '-' };

	/** @type {Map<string, typeof edus>} */
	const grouped = new Map();
	for (const edu of edus) {
		const key = edu.institute;
		if (!grouped.has(key)) grouped.set(key, []);
		grouped.get(key)?.push(edu);
	}

	let isFirstGroup = true;
	for (const [institute, entries] of grouped) {
		if (!isFirstGroup) ctx.y += EDUCATION.GAP;
		isFirstGroup = false;

		const instY = ctx.y;
		ctx.doc.setFont('helvetica', 'bold');
		ctx.doc.setFontSize(ctx.sz(FONT_RATIO.ENTRY_TITLE));
		ctx.doc.setTextColor(...COLOR.BLACK);
		ctx.doc.text(institute, ctx.marginLeft, ctx.y);

		drawRightText(ctx, entries[0].location, instY);
		ctx.y += ENTRY.TITLE_TO_SUBTITLE;

		for (const edu of entries) {
			const degreeY = ctx.y;
			ctx.doc.setFont('helvetica', 'italic');
			ctx.doc.setFontSize(ctx.baseFontSize);
			ctx.doc.setTextColor(...COLOR.DARK_GRAY);
			ctx.doc.text(edu.title, ctx.marginLeft, ctx.y);

			drawRightText(ctx, formatYearRange(edu.startTime, edu.endTime, pdfYearOpts), degreeY);
			ctx.y += EDUCATION.LINE_HEIGHT;
		}

		const allWorks = entries.flatMap((edu) => edu.works ?? []);
		if (allWorks.length) {
			for (const work of allWorks) {
				ctx.doc.setFont('helvetica', 'normal');
				ctx.doc.setFontSize(ctx.baseFontSize);
				ctx.doc.setTextColor(...COLOR.DARK_GRAY);
				ctx.doc.text(work, ctx.marginLeft, ctx.y);
				ctx.y += EDUCATION.LINE_HEIGHT;
			}
		}

		const allCourseworks = entries.flatMap((edu) => edu.courseworks ?? []);
		if (allCourseworks.length) {
			const courseworkText = 'Relevant coursework: ' + allCourseworks.join(', ');
			ctx.doc.setFont('helvetica', 'normal');
			ctx.doc.setFontSize(ctx.baseFontSize);
			ctx.doc.setTextColor(...COLOR.DARK_GRAY);
			const lines = ctx.doc.splitTextToSize(courseworkText, ctx.contentWidth);
			for (const line of lines) {
				ctx.doc.text(line, ctx.marginLeft, ctx.y);
				ctx.y += EDUCATION.LINE_HEIGHT;
			}
		}
	}
}

/**
 * @param {PdfContext} ctx
 * @param {Record<string, any>} meta
 */
function renderSkills(ctx, meta) {
	if (!meta.skills?.publish || !meta.skills.content?.length) return;
	drawSectionHeader(ctx, 'Skills');
	for (const skill of published(meta.skills.content)) {
		if (!skill.description) continue;
		drawLabeledLine(ctx, `${skill.title}: `, skill.description);
	}
}

/**
 * @param {PdfContext} ctx
 * @param {Record<string, any>} meta
 */
function renderInterests(ctx, meta) {
	if (!meta.interests?.publish || !meta.interests.content?.length) return;
	const interests = published(meta.interests.content);
	if (!interests.length) return;
	drawLabeledLine(ctx, 'Interests/Hobbies: ', interests.map((i) => i.title).join(', '));
}

// ── Main entry point ──

/**
 * Generate a resume PDF and return it as an ArrayBuffer.
 * @param {Record<string, any>} meta - Resume metadata from about.md frontmatter
 * @param {object} [options]
 * @param {number} [options.baseFontSize] - Base font size in pt (default 11)
 * @returns {ArrayBuffer}
 */
export function generateResumePdf(meta, options = {}) {
	const baseFontSize = options.baseFontSize ?? BASE_FONT_SIZE;

	const doc = new jsPDF({ unit: 'mm', format: 'a4' });
	const contentWidth = PAGE.WIDTH - PAGE.MARGIN_LEFT - PAGE.MARGIN_RIGHT;
	const maxY = PAGE.HEIGHT - PAGE.MARGIN_BOTTOM;

	/** @type {PdfContext} */
	const ctx = {
		doc,
		y: PAGE.MARGIN_TOP,
		baseFontSize,
		marginLeft: PAGE.MARGIN_LEFT,
		marginRight: PAGE.MARGIN_RIGHT,
		pageWidth: PAGE.WIDTH,
		contentWidth,
		sz: (/** @type {number} */ ratio) => baseFontSize * ratio
	};

	renderHeader(ctx, meta);
	renderSummary(ctx, meta);
	renderExperience(ctx, meta);
	renderEducation(ctx, meta);
	renderSkills(ctx, meta);
	renderInterests(ctx, meta);

	// Auto-scale: retry with smaller font if content overflows
	if (ctx.y > maxY && baseFontSize > 6) {
		return generateResumePdf(meta, { baseFontSize: baseFontSize - 0.5 });
	}

	return doc.output('arraybuffer');
}
