# Tools Bin

A free, open-source collection of **26 developer tools** — all in one place. Built with React 18 + Vite on the frontend and Express.js on the backend. Every tool (except YouTube Transcript) runs entirely client-side for maximum privacy and speed.

## Quick Start

```bash
npm install
npm run dev
```

This starts **both** the frontend (port **5173**) and the backend (port **3001**) concurrently.

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Tools (26)

### Core Tools
| Tool | Description |
|------|-------------|
| YouTube Transcript | Extract transcripts from YouTube videos in Plain Text, Timestamped, SRT, and JSON |
| JSON Formatter | Beautify, minify, and validate JSON with configurable indentation |
| Image Compressor | Compress and resize images (JPEG, PNG, WebP) in the browser |
| Hash Generator | Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files |
| Timestamp Converter | Convert between Unix timestamps, ISO dates, and human-readable formats |
| Color Picker | Pick colors and convert between HEX, RGB, HSL with visual sliders |

### Encoding & Decoding
| Tool | Description |
|------|-------------|
| Base64 Encoder/Decoder | Encode text to Base64 or decode Base64 strings |
| URL Encoder/Decoder | Encode and decode URL components with special characters |
| JWT Decoder | Decode JSON Web Tokens and inspect header, payload, expiration |

### Text & Code
| Tool | Description |
|------|-------------|
| Regex Tester | Test regular expressions with live match highlighting and capture groups |
| Markdown Preview | Write Markdown with live rendered HTML preview, export to HTML |
| Text Diff Checker | Compare two texts and highlight differences (line or word mode) |
| Case Converter | Convert between camelCase, snake_case, PascalCase, kebab-case, and 8 more |
| Lorem Ipsum Generator | Generate placeholder text by paragraphs, sentences, or words |

### Generators
| Tool | Description |
|------|-------------|
| UUID Generator | Generate UUID v4 identifiers in bulk with formatting options |
| Password Generator | Generate strong passwords with customizable length and character sets |
| QR Code Generator | Create QR codes from text or URLs, customize color and size |
| CSS Gradient Generator | Design linear/radial CSS gradients visually with multiple color stops |

### Data Conversion
| Tool | Description |
|------|-------------|
| CSV / JSON Converter | Convert between CSV and JSON formats |
| YAML / JSON Converter | Convert between YAML and JSON with validation |
| Number Base Converter | Convert between binary, octal, decimal, and hexadecimal |
| Unit Converter | Convert CSS units, data sizes, temperature, time, length, and weight |

### Developer Utilities
| Tool | Description |
|------|-------------|
| Cron Expression Parser | Parse cron expressions to human-readable descriptions with next run times |
| SQL Formatter | Beautify SQL queries with dialect support (MySQL, PostgreSQL, SQLite, T-SQL) |
| HTTP Status Codes | Searchable reference for all common HTTP response status codes |
| Meta Tag Generator | Generate SEO meta tags, Open Graph, and Twitter Card HTML |

## Docker

Run the entire app in a single container:

```bash
docker compose up --build
```

This builds the React frontend, bundles it with the Express server, and serves everything on **port 3001**.

Open [http://localhost:3001](http://localhost:3001) in your browser.

To run in the background:

```bash
docker compose up --build -d
```

To stop:

```bash
docker compose down
```

The container uses a multi-stage build (Node 22 Alpine) to keep the image small and auto-restarts on failure.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, React Router
- **Backend**: Express.js (only used for YouTube transcript proxy)
- **Code Splitting**: Lazy-loaded routes for fast initial page load
- **SEO**: react-helmet-async, per-page meta tags, JSON-LD structured data, sitemap.xml, robots.txt

## Project Structure

```
tools-bin/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Layout, Sidebar, ToolCard, SEO
│   │   └── pages/        # 26 tool pages + Home
│   └── public/           # robots.txt, sitemap.xml, og-image.svg
├── server/               # Express backend
│   └── index.js          # YouTube transcript API proxy
├── package.json          # Root — runs both services
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # One-command Docker startup
├── .dockerignore
└── README.md
```

## Ports

| Mode        | URL                    | Port |
|-------------|------------------------|------|
| Development | http://localhost:5173  | 5173 (frontend) + 3001 (API) |
| Docker      | http://localhost:3001  | 3001 (everything) |

Both ports are hardcoded and will not change between runs.
