# Interactive Bar Chart Viewer

[Live Demo](https://harsimrankalsi.com/)

A dynamic bar chart viewer built with TypeScript and SimpleKit for the CS349 (User Interfaces) course at the University of Waterloo. The entire UI is rendered on a single canvas—no DOM layout or CSS.

## Features
- Responsive layout that scales with window size
- Animated bar transitions and button selection states
- Hover tooltips and keyboard-controlled bar adjustments (Shift for larger steps)
- Dataset switching via buttons or flick gestures
- Persistence of bar adjustments while you explore datasets

## Getting Started
```bash
git clone https://github.com/StandingToaster/Interactive-Bar-Chart-Viewer.git
cd Interactive-Bar-Chart-Viewer
npm install
npm run dev -- --open
```

`npm install` pulls in SimpleKit automatically via `package.json`.

## Development Scripts
- `npm run dev` – start the Vite development server
- `npm run build` – type-check and produce the production build in `dist`
- `npm run preview` – serve the built bundle locally for a final sanity check

## Deployment
A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site and publishes it to GitHub Pages whenever `main` is updated or the workflow is dispatched manually. The production app is hosted at **https://harsimrankalsi.com/**.

Forking this project? Update `vite.config.ts` with your own `base` path and swap the `public/CNAME` file for your domain (or delete it to fall back to the default `<username>.github.io` URL).
