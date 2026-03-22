/**
 * RGB color tuples used throughout the PDF:
 * ```
 *  Jie-Ting Jiang                        ← BLACK
 *  email • website • github              ← TEAL
 *
 *  Experience                            ← BLACK
 *  ──────────────────────────
 *  Frontend Engineer                     ← BLACK
 *  Pay Web Dev, Line Pay                 ← DARK_GRAY
 *    ● Built and scaled a BI platform... ← DARK_GRAY
 * ```
 * @type {{ TEAL: [number, number, number], BLACK: [number, number, number], DARK_GRAY: [number, number, number] }}
 */
export const COLOR = {
	TEAL: [0, 151, 167],
	BLACK: [0, 0, 0],
	DARK_GRAY: [51, 51, 51]
};

/**
 * Font size ratios (multiplied by baseFontSize to get pt):
 * ```
 *  ┌──────────────────────────────────────────┐
 *  │  Jie-Ting Jiang           ← NAME (2.4×)  │
 *  │  email • website • github ← CONTACT(.89) │
 *  │                                          │
 *  │  Experience            ← SECTION_HEADER  │
 *  │  ──────────────────────    (1.56×)       │
 *  │  Frontend Engineer     ← ENTRY_TITLE     │
 *  │  Pay Web Dev, Line Pay     (1.11×)       │
 *  └──────────────────────────────────────────┘
 * ```
 */
export const FONT_RATIO = {
	NAME: 2.4,
	CONTACT: 0.89,
	SECTION_HEADER: 1.56,
	ENTRY_TITLE: 1.11
};

/**
 * Header block — name and contact links at the top (mm):
 * ```
 *  ─ y ─────────────────────────────────────
 *         ↕ BASELINE_OFFSET (6)
 *  Jie-Ting Jiang
 *         ↕ (BLOCK_HEIGHT − BASELINE_OFFSET = 5)
 *  ─ y + BLOCK_HEIGHT (11) ─────────────────
 *  email  •  website  •  github
 *         ↕ CONTACT_HEIGHT (2)
 *  ─────────────────────────────────────────
 * ```
 */
export const HEADER = {
	BASELINE_OFFSET: 6,
	BLOCK_HEIGHT: 11,
	CONTACT_HEIGHT: 2
};

/**
 * Section header — title text with horizontal rule below (mm):
 * ```
 *  ...previous content...
 *         ↕ SPACE_ABOVE (6)
 *  Experience
 *         ↕ RULE_GAP (2)
 *  ───────────────────────────
 *         ↕ SPACE_BELOW (4)
 *  ...section content...
 * ```
 */
export const SECTION = {
	SPACE_ABOVE: 6,
	RULE_GAP: 2,
	SPACE_BELOW: 4
};

/**
 * Entry layout — shared by Experience and Education entries (mm):
 * ```
 *  Frontend Engineer              Jan 2025 - Present
 *         ↕ TITLE_TO_SUBTITLE (4)
 *  Pay Web Dev, Line Pay             Taipei, Taiwan
 *         ↕ SUBTITLE_TO_CONTENT (4.5)
 *    ● Led full migration of...
 *         ↕ BULLET_GAP (1)
 *    ● Introduced AI-assisted development...
 *  ...end of first job...
 *         ↕ JOB_GAP (3)
 *  Senior BI Engineer             Oct 2022 - Aug 2025
 * ```
 */
export const ENTRY = {
	TITLE_TO_SUBTITLE: 4,
	SUBTITLE_TO_CONTENT: 4.5,
	BULLET_GAP: 1,
	JOB_GAP: 3
};

/**
 * Project groups — sub-sections within an experience entry (mm):
 * ```
 *  Cross-Framework Migration & AI Tooling    ← group name
 *         ↕ NAME_GAP (4.5)
 *    ● Led full migration of...              ← bullets
 *  ...end of group bullets...
 *         ↕ GAP (0)
 *  Line Pay Finance Platform                 ← next group
 * ```
 */
export const PROJECT_GROUP = {
	GAP: 0,
	NAME_GAP: 4.5
};

/**
 * Education section — institutes with degrees, works, coursework (mm):
 * ```
 *  Johannes Kepler Universität          Linz, Austria
 *         ↕ ENTRY.TITLE_TO_SUBTITLE (4)     (shared)
 *  Master of Science in Informatics          2015-2017
 *         ↕ LINE_HEIGHT (3.5)
 *  Internship: IT Department, SKF Group
 *         ↕ LINE_HEIGHT (3.5)
 *  Relevant coursework: Data Visualization, ...
 *         ↕ GAP (1.5)
 *  National Sun Yat-Sen University   Kaohsiung, Taiwan
 * ```
 */
export const EDUCATION = {
	GAP: 1.5,
	LINE_HEIGHT: 3.5
};

/**
 * Labeled lines — bold label + wrapped value, for Skills and Interests (mm):
 * ```
 *  Programming Languages: Python, JavaScript, C++,
 *         ↕ LINE_HEIGHT (4.5)
 *  SQL, Golang, Django, React, Svelte, Node.js
 *         ↕ LINE_HEIGHT (4.5)
 *  Data Visualization: D3.js, Three.js, Deck.gl, ...
 * ```
 */
export const LABELED = {
	LINE_HEIGHT: 4.5
};

/**
 * Default line-height multiplier for wrapped body text
 * (e.g. the Summary paragraph). Multiplied by font size
 * and converted from pt to mm.
 */
export const LINE_HEIGHT = 1.45;

/**
 * A4 page dimensions and margins (mm):
 * ```
 *  ┌─────────────────── 210 (WIDTH) ────────────────────┐
 *  │                  MARGIN_TOP (7)                    │
 *  │  ┌───────────────────────────────────────────┐     │
 *  │  │                                           │     │
 *  │  │                content area               │     │
 *  │  │                  190 × 283                │     │ ↕ 297 (HEIGHT)
 *  │  │                                           │     │
 *  │  │                                           │     │
 *  │  └───────────────────────────────────────────┘     │
 *  │                 MARGIN_BOTTOM (7)                  │
 *  └────────────────────────────────────────────────────┘
 *    ↔ MARGIN_LEFT (10)             MARGIN_RIGHT (10) ↔
 * ```
 */
export const PAGE = {
	WIDTH: 210,
	HEIGHT: 297,
	MARGIN_TOP: 7,
	MARGIN_BOTTOM: 7,
	MARGIN_LEFT: 10,
	MARGIN_RIGHT: 10
};

/** Default base font size in pt. */
export const BASE_FONT_SIZE = 11;
