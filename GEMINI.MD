# Project Context for AI Assistants (GEMINI.MD)

This file provides essential context, architectural details, and coding conventions for Gemini and other AI assistants working on this repository.

## 1. Project Overview
This repository contains the interactive portfolio for **Vojaswwin**, a Product Manager. 
The application acts as a single-page interactive showcase featuring their resume, product design teardowns, case competition slides, PRDs, and a custom AI chatbot called "Ask Vojaswwin".

## 2. Tech Stack
*   **Core Framework:** React 19 + TypeScript + Vite
*   **Styling:** Tailwind CSS v4 + PostCSS
*   **Animations:** GSAP (ScrollTrigger enabled), Framer Motion
*   **Scroll Management:** Lenis (for smooth scrolling)
*   **Icons:** Lucide React
*   **PDF Rendering:** pdfjs-dist
*   **Deployment:** Vercel

## 3. Directory Structure
*   `src/App.tsx`: The primary layout, routing, and GSAP scroll-trigger animations.
*   `src/components/`:
    *   `AskVojaswwin.tsx`: The interactive chatbot interface.
    *   `Morphing*.tsx` (e.g., `MorphingO.tsx`, `AmpersandMorph.tsx`): Complex SVG path animations used in the hero section.
    *   `ArtifactGallery.tsx`, `ProductShowcase.tsx`: Galleries that display the user's PDF case studies and vibe-coded projects.
    *   `CosmicBackground.tsx`: Interactive background element.
*   `api/`: Contains Vercel serverless functions.
    *   `api/chat.js`: A secure Node.js proxy to communicate with the Gemini API (`gemini-2.5-flash`).
*   `Artefacts/`: Contains static PDFs (resume, case studies, teardowns). Served by a custom Vite plugin during development and copied to `dist/` on build.
*   `public/`: Contains standard static assets (thumbnails, logos).

## 4. Key Development Rules & Conventions

### A. Security & API Keys
*   **NEVER** use the `VITE_` prefix for the Gemini API key or expose it in the frontend code.
*   All requests to the Gemini API must be routed through the serverless function at `/api/chat.js`.
*   The serverless function reads `process.env.GEMINI_API_KEY` securely from the Vercel environment.

### B. Animations & Scrolling
*   **GSAP:** Use GSAP for all scroll-triggered animations and complex sequenced timelines (e.g., the hero section sequence in `App.tsx`).
*   **Framer Motion:** Can be used for simple, component-level state transitions (e.g., modal opening/closing).
*   **Lenis:** The site uses Lenis for smooth scrolling. Ensure any new scroll listeners or GSAP `ScrollTrigger` instances are compatible with the Lenis scroll context.

### C. Styling
*   The project uses **Tailwind CSS v4**.
*   Avoid adding custom CSS to `index.css` unless absolutely necessary (e.g., base styles or keyframes that Tailwind cannot handle easily). Rely on Tailwind utility classes.

### D. Asset Management
*   Any new PDF case studies or documents should be placed in the `Artefacts/` directory.
*   The `vite.config.ts` includes a custom plugin to serve `Artefacts/` in development and copy it to `dist/` during the production build. Ensure this plugin is maintained if the build process changes.
*   Thumbnails for projects should be placed in `public/thumbnails/` and referenced via absolute paths (e.g., `/thumbnails/bookmyshow.png`).

## 5. Typical Workflows
*   **Running locally:** `npm run dev`
*   **Building:** `npm run build`
*   **Adding a new portfolio project:** Add the PDF to `Artefacts/`, create a thumbnail in `public/thumbnails/`, and update the corresponding array (e.g., `productTeardownsArtifacts`) in `src/App.tsx`.
