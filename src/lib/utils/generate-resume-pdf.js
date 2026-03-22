import { jsPDF } from 'jspdf';

/**
 * @param {string} dateStr
 */
function formatDate(dateStr) {
	if (!dateStr) return 'Present';
	const d = new Date(dateStr);
	return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

/**
 * @param {string} startTime
 * @param {string | null | undefined} endTime
 */
function formatDateRange(startTime, endTime) {
	const start = formatDate(startTime);
	const end = endTime ? formatDate(endTime) : 'Present';
	return `${start} - ${end}`;
}

/**
 * @param {string} startTime
 * @param {string | null | undefined} endTime
 */
function formatYearRange(startTime, endTime) {
	const startYear = new Date(startTime).getFullYear();
	const endYear = endTime ? new Date(endTime).getFullYear() : undefined;
	if (endYear && endYear !== startYear) {
		return `${startYear}-${endYear}`;
	}
	return `${startYear}`;
}

/**
 * @template {Record<string, any> & {publish: boolean}} T
 * @param {T[] | null | undefined} items
 * @returns {T[]}
 */
function published(items) {
	return items?.filter((item) => item.publish) ?? [];
}

/**
 * @param {Record<string, any>} meta - Resume metadata from about.md frontmatter
 * @param {object} [options]
 * @param {number} [options.baseFontSize] - Base font size in pt (default 9)
 */
export function generateResumePdf(meta, options = {}) {
	const baseFontSize = options.baseFontSize ?? 11;

	const doc = new jsPDF({ unit: 'mm', format: 'a4' });
	const pageWidth = 210;
	const pageHeight = 297;
	const marginLeft = 10;
	const marginRight = 10;
	const marginTop = 7;
	const marginBottom = 7;
	const contentWidth = pageWidth - marginLeft - marginRight;
	const maxY = pageHeight - marginBottom;

	let y = marginTop;

	/** @type {[number, number, number]} */
	const TEAL = [13, 148, 136];
	/** @type {[number, number, number]} */
	const BLACK = [0, 0, 0];
	/** @type {[number, number, number]} */
	const DARK_GRAY = [51, 51, 51];

	// Font size helpers relative to base
	const sz = (/** @type {number} */ ratio) => baseFontSize * ratio;

	// ── Spacing constants (mm) ──
	const SECTION_SPACE_ABOVE = 6;
	const SECTION_RULE_GAP = 2;
	const SECTION_SPACE_BELOW = 4;
	const JOB_GAP = 3;
	const PROJECT_GROUP_GAP = 0;
	const BULLET_GAP = 1;
	const EDUCATION_GAP = 1.5;
	const TITLE_TO_SUBTITLE = 4;
	const SUBTITLE_TO_CONTENT = 4.5;
	const SKILL_LINE_HEIGHT = 4.5;
	const LINE_HEIGHT = 1.45;

	// ── Name ──
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(sz(2.4));
	doc.setTextColor(...BLACK);
	doc.text(meta.title, marginLeft, y + 6);
	y += 11;

	// ── Contact line ──
	const contactParts = [];
	if (meta.email) contactParts.push(meta.email);
	if (meta.website) contactParts.push(meta.website);
	if (meta.github) contactParts.push(meta.github);

	if (contactParts.length) {
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(sz(0.89));
		doc.setTextColor(...TEAL);
		const contactLine = contactParts.join(' \u2022 ');
		doc.text(contactLine, marginLeft, y);
		// Add clickable links
		let linkX = marginLeft;
		for (let i = 0; i < contactParts.length; i++) {
			const part = contactParts[i];
			const partWidth = doc.getTextWidth(part);
			const url = part.includes('@')
				? `mailto:${part}`
				: part.startsWith('http')
					? part
					: `https://${part}`;
			doc.link(linkX, y - 3, partWidth, 4, { url });
			if (i < contactParts.length - 1) {
				linkX += partWidth + doc.getTextWidth(' \u2022 ');
			}
		}
		y += 2;
	}

	/**
	 * Draw a section header with a horizontal rule
	 * @param {string} title
	 */
	function drawSectionHeader(title) {
		y += SECTION_SPACE_ABOVE;
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(sz(1.56));
		doc.setTextColor(...BLACK);
		doc.text(title, marginLeft, y);
		y += SECTION_RULE_GAP;
		doc.setDrawColor(0, 0, 0);
		doc.setLineWidth(0.3);
		doc.line(marginLeft, y, pageWidth - marginRight, y);
		y += SECTION_SPACE_BELOW;
	}

	/**
	 * Draw wrapped text and advance y
	 * @param {string} text
	 * @param {number} x
	 * @param {number} maxWidth
	 * @param {object} [opts]
	 * @param {'normal'|'bold'|'italic'|'bolditalic'} [opts.fontStyle]
	 * @param {number} [opts.fontSize] - in pt
	 * @param {[number, number, number]} [opts.color]
	 * @param {number} [opts.lineHeight] - multiplier
	 */
	function drawText(text, x, maxWidth, opts = {}) {
		const {
			fontStyle = 'normal',
			fontSize = baseFontSize,
			color = DARK_GRAY,
			lineHeight = LINE_HEIGHT
		} = opts;
		doc.setFont('helvetica', fontStyle);
		doc.setFontSize(fontSize);
		doc.setTextColor(...color);
		const lines = doc.splitTextToSize(text, maxWidth);
		const lh = (fontSize * lineHeight * 25.4) / 72; // pt to mm
		for (const line of lines) {
			doc.text(line, x, y);
			y += lh;
		}
	}

	/**
	 * Draw a bullet point item
	 * @param {string} text
	 * @param {number} x - left edge for the bullet
	 * @param {number} maxWidth
	 */
	function drawBullet(text, x, maxWidth) {
		const bulletIndent = 4;
		// Draw bullet dot
		doc.setFillColor(...DARK_GRAY);
		doc.circle(x + 1.2, y - 0.8, 0.6, 'F');
		// Draw text
		drawText(text, x + bulletIndent, maxWidth - bulletIndent, {
			fontSize: baseFontSize,
			color: DARK_GRAY
		});
		y += BULLET_GAP;
	}

	/**
	 * Draw right-aligned text
	 * @param {string} text
	 * @param {number} atY
	 * @param {object} [opts]
	 * @param {'normal'|'bold'} [opts.fontStyle]
	 * @param {number} [opts.fontSize]
	 * @param {[number, number, number]} [opts.color]
	 */
	function drawRightText(text, atY, opts = {}) {
		const { fontStyle = 'normal', fontSize = baseFontSize, color = DARK_GRAY } = opts;
		doc.setFont('helvetica', fontStyle);
		doc.setFontSize(fontSize);
		doc.setTextColor(...color);
		doc.text(text, pageWidth - marginRight, atY, { align: 'right' });
	}

	// ── Summary ──
	if (meta.summary) {
		drawSectionHeader('Summary');
		drawText(meta.summary, marginLeft, contentWidth, {
			fontSize: baseFontSize,
			color: DARK_GRAY
		});
	}

	// ── Experience ──
	if (meta.experience?.publish && meta.experience.content?.length) {
		drawSectionHeader('Experience');
		const jobs = published(meta.experience.content);
		for (let j = 0; j < jobs.length; j++) {
			const job = jobs[j];
			if (j > 0) y += JOB_GAP;

			// Job title and date range on same line
			const titleY = y;
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(sz(1.11));
			doc.setTextColor(...BLACK);
			doc.text(job.title, marginLeft, y);

			// Date range right-aligned
			drawRightText(formatDateRange(job.startTime, job.endTime), titleY, {
				fontSize: baseFontSize,
				color: DARK_GRAY
			});
			y += TITLE_TO_SUBTITLE;

			// Company and location on same line
			const companyY = y;
			doc.setFont('helvetica', 'normal');
			doc.setFontSize(baseFontSize);
			doc.setTextColor(...DARK_GRAY);
			doc.text(job.company, marginLeft, y);

			drawRightText(job.location, companyY, {
				fontSize: baseFontSize,
				color: DARK_GRAY
			});
			y += SUBTITLE_TO_CONTENT;

			// Direct works
			if (job.works?.length) {
				for (const work of job.works) {
					drawBullet(work, marginLeft + 2, contentWidth - 2);
				}
			}

			// Project groups
			if (job.projectGroups?.length) {
				for (let g = 0; g < job.projectGroups.length; g++) {
					const group = job.projectGroups[g];
					if (g > 0) y += PROJECT_GROUP_GAP;

					// Group name
					doc.setFont('helvetica', 'bold');
					doc.setFontSize(baseFontSize);
					doc.setTextColor(...BLACK);
					doc.text(group.name, marginLeft, y);
					y += 4.5;

					if (group.works?.length) {
						for (const work of group.works) {
							drawBullet(work, marginLeft + 2, contentWidth - 2);
						}
					}
				}
			}
		}
	}

	// ── Education (grouped by institute) ──
	if (meta.education?.publish && meta.education.content?.length) {
		drawSectionHeader('Education');
		const edus = published(meta.education.content);

		// Group by institute, preserving order of first appearance
		/** @type {Map<string, typeof edus>} */
		const grouped = new Map();
		for (const edu of edus) {
			const key = edu.institute;
			if (!grouped.has(key)) grouped.set(key, []);
			grouped.get(key)?.push(edu);
		}

		let groupIdx = 0;
		for (const [institute, entries] of grouped) {
			if (groupIdx > 0) y += EDUCATION_GAP;

			// Institute name and location (from first entry)
			const instY = y;
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(sz(1.11));
			doc.setTextColor(...BLACK);
			doc.text(institute, marginLeft, y);

			drawRightText(entries[0].location, instY, {
				fontSize: baseFontSize,
				color: DARK_GRAY
			});
			y += TITLE_TO_SUBTITLE;

			// Each degree under this institute
			for (let d = 0; d < entries.length; d++) {
				const edu = entries[d];

				const degreeY = y;
				doc.setFont('helvetica', 'italic');
				doc.setFontSize(baseFontSize);
				doc.setTextColor(...DARK_GRAY);
				doc.text(edu.title, marginLeft, y);

				drawRightText(formatYearRange(edu.startTime, edu.endTime), degreeY, {
					fontSize: baseFontSize,
					color: DARK_GRAY
				});
				y += 3.5;
			}

			// Grouped works from all entries under this institute
			const allWorks = entries.flatMap((edu) => edu.works ?? []);
			if (allWorks.length) {
				for (const work of allWorks) {
					doc.setFont('helvetica', 'normal');
					doc.setFontSize(baseFontSize);
					doc.setTextColor(...DARK_GRAY);
					doc.text(work, marginLeft, y);
					y += 3.5;
				}
			}

			// Grouped courseworks from all entries under this institute
			const allCourseworks = entries.flatMap((edu) => edu.courseworks ?? []);
			if (allCourseworks.length) {
				const label = 'Relevant coursework: ';
				doc.setFont('helvetica', 'normal');
				doc.setFontSize(baseFontSize);
				doc.setTextColor(...DARK_GRAY);
				const courseworkText = label + allCourseworks.join(', ');
				const lines = doc.splitTextToSize(courseworkText, contentWidth);
				for (const line of lines) {
					doc.text(line, marginLeft, y);
					y += 3.5;
				}
			}

			groupIdx++;
		}
	}

	// ── Skills ──
	if (meta.skills?.publish && meta.skills.content?.length) {
		drawSectionHeader('Skills');
		const skills = published(meta.skills.content);
		for (const skill of skills) {
			if (!skill.description) continue;
			// "Category: value, value, value" format
			const label = `${skill.title}: `;
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(baseFontSize);
			doc.setTextColor(...BLACK);

			const labelWidth = doc.getTextWidth(label);

			// Check if the full line fits or needs wrapping
			doc.setFont('helvetica', 'normal');
			const descWidth = doc.getTextWidth(skill.description);
			const totalWidth = labelWidth + descWidth;

			if (totalWidth <= contentWidth) {
				// Single line
				doc.setFont('helvetica', 'bold');
				doc.text(label, marginLeft, y);
				doc.setFont('helvetica', 'normal');
				doc.setTextColor(...DARK_GRAY);
				doc.text(skill.description, marginLeft + labelWidth, y);
				y += SKILL_LINE_HEIGHT;
			} else {
				doc.setFont('helvetica', 'bold');
				doc.text(label, marginLeft, y);
				doc.setFont('helvetica', 'normal');
				doc.setTextColor(...DARK_GRAY);
				const descLines = doc.splitTextToSize(skill.description, contentWidth - labelWidth);
				doc.text(descLines[0], marginLeft + labelWidth, y);
				y += SKILL_LINE_HEIGHT;
				if (descLines.length > 1) {
					const remainingText = descLines.slice(1).join(' ');
					const rewrapped = doc.splitTextToSize(remainingText, contentWidth);
					for (const line of rewrapped) {
						doc.text(line, marginLeft, y);
						y += SKILL_LINE_HEIGHT;
					}
				}
			}
		}
	}

	// ── Interests ──
	if (meta.interests?.publish && meta.interests.content?.length) {
		const interests = published(meta.interests.content);
		if (interests.length) {
			const label = 'Interests/Hobbies: ';
			const values = interests.map((i) => i.title).join(', ');

			doc.setFont('helvetica', 'bold');
			doc.setFontSize(baseFontSize);
			doc.setTextColor(...BLACK);
			const labelWidth = doc.getTextWidth(label);
			doc.text(label, marginLeft, y);

			doc.setFont('helvetica', 'normal');
			doc.setTextColor(...DARK_GRAY);
			const descLines = doc.splitTextToSize(values, contentWidth - labelWidth);
			doc.text(descLines[0], marginLeft + labelWidth, y);
			y += SKILL_LINE_HEIGHT;
			if (descLines.length > 1) {
				const remainingText = descLines.slice(1).join(' ');
				const rewrapped = doc.splitTextToSize(remainingText, contentWidth);
				for (const line of rewrapped) {
					doc.text(line, marginLeft, y);
					y += SKILL_LINE_HEIGHT;
				}
			}
		}
	}

	// Check if content overflows and auto-scale if needed
	if (y > maxY && baseFontSize > 6) {
		return generateResumePdf(meta, { baseFontSize: baseFontSize - 0.5 });
	}

	// Generate filename from title
	const filename = meta.title
		? `${meta.title.replace(/\s+/g, '_')}_Resume.pdf`
		: 'Resume.pdf';
	doc.save(filename);
}
