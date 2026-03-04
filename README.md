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

- **YouTube Transcript Extractor** -- Paste a YouTube URL and extract its transcript in Plain Text, Timestamped, SRT, or JSON format.

More tools coming soon.
