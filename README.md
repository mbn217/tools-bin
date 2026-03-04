# Tools Bin

A modern multi-tool webapp for developers. Built with React + Express.

## Getting Started

### Prerequisites

- Node.js 18+

### Install dependencies

```bash
npm run install:all
```

### Run the app

A single command starts both the backend and frontend:

```bash
npm run dev
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:3001      |

The frontend proxies all `/api` requests to the backend automatically.

### Run individually (optional)

```bash
# Backend only
cd server && npm run dev

# Frontend only
cd client && npm run dev
```

## Ports

Ports are hardcoded to avoid conflicts and keep things predictable:

- **5173** -- Vite dev server (frontend)
- **3001** -- Express API server (backend)

## Available Tools

| Tool | Description |
|------|-------------|
| **YouTube Transcript** | Paste a YouTube URL and extract its transcript in Plain Text, Timestamped, SRT, or JSON format. |
| **JSON Formatter** | Beautify, minify, and validate JSON data with real-time validation feedback. |
| **Image Compressor** | Compress and resize images client-side via the Canvas API. Supports JPEG, PNG, and WebP output. |
| **Hash Generator** | Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files using the Web Crypto API. |
| **Timestamp Converter** | Convert between Unix timestamps (seconds and milliseconds), ISO 8601, UTC strings, and relative time. |
| **Color Picker** | Pick colors with a visual picker and RGB/HSL sliders. Copy results as HEX, RGB, HSL, or RGBA. |

## SEO

Every page is optimized for search engines:

- **Per-page meta tags** -- Unique `<title>`, `<meta name="description">`, and `<link rel="canonical">` managed by `react-helmet-async`.
- **Open Graph & Twitter Cards** -- Full OG and Twitter meta for rich previews when shared on social media.
- **JSON-LD structured data** -- `WebApplication` schema on the home and YouTube transcript pages for rich search results.
- **Static SEO files** -- `robots.txt` (allows all crawlers) and `sitemap.xml` (all 7 pages with priorities) in `client/public/`.
- **Fallback meta in `index.html`** -- Crawlers that don't execute JavaScript still see the default meta tags, `<noscript>` fallback, and `<html lang="en">`.
- **OG image** -- SVG-based Open Graph image at `public/og-image.svg`.

To customize for your own domain, update the `BASE_URL` constant in `client/src/components/SEO.jsx` and the static references in `index.html`, `robots.txt`, and `sitemap.xml`.

## Tech Stack

- **Frontend** -- React 18, Vite, Tailwind CSS, Framer Motion, React Router, Lucide icons, react-helmet-async
- **Backend** -- Express.js, youtube-transcript-plus
