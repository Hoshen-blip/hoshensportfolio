# Hoshen Lichi Portfolio Website

One-page static portfolio website for Hoshen Lichi, a junior Product Manager candidate. The site is designed to help recruiters and product leaders quickly understand Hoshen's PM positioning, military operations credibility, AI implementation experience, and strongest product case study: pick-IT.

## Tech Stack

- Astro v4 static output
- Tailwind CSS v3
- Vanilla JavaScript i18n with `localStorage`
- Static assets served from `/public/assets`
- Vercel-ready configuration

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Environment Variables

No environment variables are required for the MVP. `.env.example` is included only as a safe placeholder for future v2 features.

## MVP Features Implemented

- Hero section with color portrait, positioning, CTAs, and impact metric pills
- About section with condensed PM narrative and credential row
- How I Build section with 5 AI/product delivery cards
- Product Skills grid with 9 PM-relevant skills and CSS-colored text symbols
- Five project case study cards
- Featured pick-IT case study inside the Projects section, with UI screenshot, YouTube embed, metrics, PSI cards, flow diagram, and decision grid
- Contact section with email, LinkedIn, and CV download
- English/Hebrew language toggle with persisted preference and RTL support
- Reduced-motion-aware section reveal and metric count-up animations
- SEO meta tags, OG tags, security headers, skip-to-main link, focus states, and responsive layout
- WebP image assets and lazy loading for below-fold media

## Intentionally Not Implemented

The following development-plan P2 tasks are intentionally excluded from this MVP:

- T021 extended animated scroll transitions beyond the MVP reveal/count-up behavior
- T022 project modal or inline expansion
- T023 dark mode toggle
- T024 analytics
- T025 contact form with Supabase/N8N backend
- T026 case study downloadable PDFs
- T027 testimonials section

## Assumptions Made

- Recommendation letter Google Drive URL is not available, so recommendation links are hidden.
- Dashboard, procurement, and major explorer live URLs are null, so "View Project" links are hidden.
- Placeholder v3 copy was used for hero pills, credential tiles, How I Build cards, flow labels, decision grid content, and constraint pills until owner-provided final copy is available.
- `hoshens photo 2.png` was cropped to `portrait-gaze.webp` for the v6 hero portrait.
- `pick-it-hero.png` is used as the pick-IT project card image; `pick-it-ui-ux.png` is cropped and converted to `pick-it-ui.webp` for the featured case study.
- Dashboard, procurement, major explorer, arch-viz, and pick-IT visuals were converted to local WebP assets.
- Hebrew copy is AI-generated and marked by `__ownerReviewNote` in `src/i18n/he.json`; it needs owner review before launch.
- Actual Vercel deployment, Lighthouse production audit, and Windows Chrome DevTools font verification require access to the target browser/deployment environment.

## Known Limitations

- Recommendation letter is hidden until a real URL is added in `src/data/site.ts`.
- Project visuals now render from local WebP assets; final content review is still recommended before launch.
- Lighthouse and WCAG tooling should be run again against the deployed Vercel URL.
- `npm audit` reports vulnerabilities in the installed dependency tree; review before production if the lockfile is reused long-term.
