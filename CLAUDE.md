# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start local dev server (Vite + custom Artefacts middleware)
npm run build     # Type-check then build to dist/
npm run lint      # ESLint
npm run preview   # Preview the production build locally
```

No test suite is configured.

## Architecture

This is a single-page React 19 + TypeScript + Vite portfolio for Vojaswwin, a Product Manager.

**`src/App.tsx`** is the entire application. It owns:
- All section layout (Home, Proof of Work, Playground, About — four sections)
- All artifact data arrays (case competitions, product teardowns, PRDs, etc.) — adding a new portfolio item means updating these arrays directly in App.tsx
- All GSAP scroll animations: desktop uses a horizontal pin (`ScrollTrigger` id `'main-pin'`) that slides Home → Proof side-by-side; mobile stacks vertically with fade-in triggers
- Hero entry animations (ball morph, ampersand flip, money morph, name text + curved SVG arrow)

**`src/components/`** — self-contained presentational components:
- `ArtifactGallery.tsx` / `ProductShowcase.tsx` — render PDF case studies and vibe-coded projects
- `AskVojaswwin.tsx` — floating AI chatbot; calls `/api/chat` (Vercel serverless) which proxies to Gemini
- `MorphingO.tsx`, `MorphingMoneySS.tsx`, `AmpersandMorph.tsx` — SVG path animations in the hero headline
- `CosmicBackground.tsx` — interactive canvas background
- `PDFViewer.tsx`, `PDFThumbnail.tsx` — use `pdfjs-dist` to render PDFs inline

**`api/chat.js`** — Vercel serverless function; reads `GEMINI_API_KEY` from `process.env` (never from the client). Model: `gemini-2.5-flash`.

**`Artefacts/`** — PDF files (resume, case studies, teardowns, PRDs). Not in `public/`; served by a custom Vite dev middleware and copied to `dist/Artefacts/` at build time via a `closeBundle` plugin in `vite.config.ts`. Reference paths as `/Artefacts/...` in code.

**`public/thumbnails/`** — Thumbnail images for artifact cards. Reference as `/thumbnails/<name>.png`.

## Key conventions

- **API key security**: `GEMINI_API_KEY` must only live in Vercel environment variables. Never use `VITE_` prefix for it. All Gemini requests go through `/api/chat.js`.
- **Animations**: GSAP for scroll-triggered and sequenced animations; Framer Motion for simple component state transitions. Lenis handles smooth scrolling — new `ScrollTrigger` instances must be compatible with the Lenis context.
- **Styling**: Tailwind CSS v4. Avoid adding to `src/index.css` unless Tailwind cannot handle it (e.g. keyframe definitions).
- **Adding a portfolio artifact**: drop the PDF in `Artefacts/<category>/`, add a thumbnail to `public/thumbnails/`, then add an entry to the relevant array in `src/App.tsx` (e.g. `productTeardownsArtifacts`).
- **Deployment**: Vercel. The `.vercel/project.json` links to the live project.
