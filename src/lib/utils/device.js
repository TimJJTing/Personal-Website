/**
 * This script literally just checks if your browser is capable of hovering over items without clicking, basically if you have a mouse or not.
 * In my opinion, it's better than trying to filter out endless types of phone brands from the navigator's user agent with regex. Generally, mobile devices don't use mice, and those that do should receive the desktop experience.
 * Credit: https://xobyte.org/scripts/isMobile.js
 * @returns {boolean}
 */
export function isMobile() {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(any-hover:none)').matches;
}
