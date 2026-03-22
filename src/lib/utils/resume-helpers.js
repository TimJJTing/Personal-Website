/**
 * @param {string} dateStr
 * @param {object} [options]
 * @param {'long'|'short'|'narrow'|'numeric'|'2-digit'} [options.monthFormat]
 */
export function formatDate(dateStr, { monthFormat = 'short' } = {}) {
	if (!dateStr) return 'Present';
	const d = new Date(dateStr);
	return d.toLocaleDateString('en-US', { year: 'numeric', month: monthFormat });
}

/**
 * @param {string} startTime
 * @param {string | null | undefined} endTime
 * @param {object} [options]
 * @param {string} [options.separator]
 * @param {'long'|'short'|'narrow'|'numeric'|'2-digit'} [options.monthFormat]
 */
export function formatDateRange(startTime, endTime, { separator = ' \u2014 ', monthFormat = 'short' } = {}) {
	const start = formatDate(startTime, { monthFormat });
	const end = endTime ? formatDate(endTime, { monthFormat }) : 'Present';
	return `${start}${separator}${end}`;
}

/**
 * @param {string} startTime
 * @param {string | null | undefined} endTime
 * @param {object} [options]
 * @param {string} [options.separator]
 */
export function formatYearRange(startTime, endTime, { separator = ' \u2014 ' } = {}) {
	const startYear = new Date(startTime).getFullYear();
	const endYear = endTime ? new Date(endTime).getFullYear() : undefined;
	if (endYear && endYear !== startYear) {
		return `${startYear}${separator}${endYear}`;
	}
	return `${startYear}`;
}

/**
 * @template {Record<string, any> & {publish: boolean}} T
 * @param {T[] | null | undefined} items
 * @returns {T[]}
 */
export function published(items) {
	return items?.filter((item) => item.publish) ?? [];
}
