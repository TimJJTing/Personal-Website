# Personal Website

A personal website built with SvelteKit, Tailwind CSS, and mdsvex. Features a portfolio of works, articles written in Markdown, an about/resume page with a prerendered PDF download, and a CMS-backed content pipeline. Deployed on Netlify.

## Getting Started

Install / Activate the correct Node version and dependencies:

```bash
nvm use
pnpm install
```

### Development

```bash
# preferred, if netlify-cli is installed
netlify dev
# otherwise use pnpm dev, however, it will not work properly
# because it cannot use Netlify Image CDN
pnpm dev
```

### Build

```bash
pnpm build
pnpm preview
```

### Testing & Linting

```bash
pnpm check
pnpm lint
pnpm test
```

## Tech Stack

| Category         | Technology                                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Framework        | [SvelteKit](https://kit.svelte.dev) (Svelte 5)                                                                         |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com) + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) |
| Markdown         | [mdsvex](https://mdsvex.pngwn.io) — renders `.md`/`.svx` files as Svelte components                                    |
| Markdown plugins | [remark-footnotes](https://github.com/remarkjs/remark-footnotes)                                                       |
| CMS              | [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (Git-based, GitHub backend)                                      |
| Deployment       | [Netlify](https://netlify.com) via `@sveltejs/adapter-netlify` (SSG + prerender)                                       |
| Resume PDF       | [jsPDF](https://github.com/parallax/jsPDF) — prerendered at build time from resume metadata                            |
| Image CDN        | Netlify Image CDN (requires `netlify dev` for local use)                                                               |
| Testing          | [Vitest](https://vitest.dev) (unit) + [Playwright](https://playwright.dev) (e2e)                                       |
| Linting          | ESLint + Prettier (with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`)                                    |
| Runtime          | Node 22 (see `.nvmrc`)                                                                                                 |
| Package manager  | [pnpm](https://pnpm.io)                                                                                                |

## Project Structure

```
src/
├── lib/
│   ├── components/       # Reusable Svelte components (nav, footer, item, tag, img)
│   │   └── resume/       # Resume-specific components (download button)
│   ├── markdown-layouts/ # Svelte layout wrappers for mdsvex content (article, work, links, default)
│   ├── attachments/      # Svelte action utilities (e.g. portal)
│   ├── rehype-plugins/   # Rehype plugins for mdsvex markdown processing (e.g. enhanced img)
│   └── utils/
│       └── resume/       # Resume PDF generation (consts, helpers, generate-pdf)
└── routes/
    ├── +page.svelte      # Home page
    ├── about/            # About page with Markdown content
    │   └── [filename].pdf/ # Prerendered resume PDF endpoint
    ├── articles/         # Article listing and [slug] detail pages (Markdown)
    ├── works/            # Works listing and [slug] detail pages (Markdown)
    ├── api/              # JSON endpoints for articles and works
    ├── sitemap.xml/      # Dynamic sitemap endpoint
    ├── config.md         # Site-wide config (title, description, etc.)
    └── links.md          # Links page content

static/
├── admin/                # Sveltia CMS config and UI
└── uploads/              # Media uploaded via CMS

e2e/                      # Playwright end-to-end tests
```
