import express from 'express';
import cors from 'cors';
import { fetchTranscript } from 'youtube-transcript-plus';

const app = express();
const PORT = 3001;

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// In production, serve the built React frontend
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

const HTML_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&#x2F;': '/',
};

function decodeHtmlEntities(text) {
  return text.replace(/&(?:#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match) => {
    if (HTML_ENTITIES[match]) return HTML_ENTITIES[match];
    if (match.startsWith('&#x')) return String.fromCharCode(parseInt(match.slice(3, -1), 16));
    if (match.startsWith('&#')) return String.fromCharCode(parseInt(match.slice(2, -1), 10));
    return match;
  });
}

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  return null;
}

async function fetchVideoMeta(videoId) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl);
    if (!res.ok) throw new Error('Failed to fetch metadata');
    const data = await res.json();
    return {
      title: data.title,
      author: data.author_name,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    };
  } catch {
    return {
      title: 'Unknown Title',
      author: 'Unknown',
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    };
  }
}

app.post('/api/transcript', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const videoId = extractVideoId(url.trim());
  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const [segments, meta] = await Promise.all([
      fetchTranscript(videoId),
      fetchVideoMeta(videoId),
    ]);

    res.json({
      videoId,
      title: meta.title,
      author: meta.author,
      thumbnail: meta.thumbnail,
      segments: segments.map((s) => ({
        text: decodeHtmlEntities(s.text),
        offset: Math.round(s.offset * 1000),
        duration: Math.round(s.duration * 1000),
      })),
    });
  } catch (err) {
    console.error('Transcript fetch error:', err.message);

    const message =
      err.message?.includes('disabled')
        ? 'Transcripts are disabled for this video'
        : err.message?.includes('available')
          ? 'No transcript available for this video'
          : 'Failed to fetch transcript. Please check the URL and try again.';

    res.status(422).json({ error: message });
  }
});

// SPA fallback: serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Tools Bin running on http://localhost:${PORT}`);
});
