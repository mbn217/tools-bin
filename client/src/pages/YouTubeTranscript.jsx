import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import {
  ClipboardPaste,
  Loader2,
  Copy,
  Check,
  Download,
  AlertCircle,
  RefreshCw,
  FileText,
  Clock,
  Braces,
  Captions,
  ExternalLink,
} from 'lucide-react';

const FORMAT_TABS = [
  { id: 'plain', label: 'Plain Text', icon: FileText },
  { id: 'timestamped', label: 'Timestamped', icon: Clock },
  { id: 'srt', label: 'SRT', icon: Captions },
  { id: 'json', label: 'JSON', icon: Braces },
];

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor(ms % 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
}

function formatTranscript(segments, format) {
  switch (format) {
    case 'plain':
      return segments.map((s) => s.text).join(' ');
    case 'timestamped':
      return segments
        .map((s) => {
          const ts = formatTime(s.offset).slice(0, 8);
          return `[${ts}] ${s.text}`;
        })
        .join('\n');
    case 'srt':
      return segments
        .map((s, i) => {
          const start = formatTime(s.offset);
          const end = formatTime(s.offset + s.duration);
          return `${i + 1}\n${start} --> ${end}\n${s.text}\n`;
        })
        .join('\n');
    case 'json':
      return JSON.stringify(segments, null, 2);
    default:
      return '';
  }
}

function getFileExtension(format) {
  return format === 'json' ? 'json' : format === 'srt' ? 'srt' : 'txt';
}

export default function YouTubeTranscript() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [format, setFormat] = useState('plain');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const transcriptText = useMemo(
    () => (data ? formatTranscript(data.segments, format) : ''),
    [data, format]
  );

  const wordCount = useMemo(() => {
    if (!data) return 0;
    return data.segments
      .map((s) => s.text)
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length;
  }, [data]);

  async function handleExtract() {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      inputRef.current?.focus();
    } catch {
      // clipboard access denied
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(transcriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const ext = getFileExtension(format);
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${data?.title || 'transcript'}.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleExtract();
  }

  return (
    <div className="max-w-4xl">
      <SEO
        title="YouTube Transcript Extractor"
        description="Extract transcripts from any YouTube video for free. Download as plain text, SRT subtitles, timestamped text, or JSON. No sign-up required."
        path="/youtube-transcript"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'YouTube Transcript Extractor',
          url: 'https://toolsbin.dev/youtube-transcript',
          description: 'Extract transcripts from any YouTube video. Download as plain text, SRT, timestamped, or JSON.',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
          YouTube Transcript Extractor
        </h1>
        <p className="text-gray-500 text-sm">
          Paste a YouTube video link and extract its transcript in various formats.
        </p>
      </motion.div>

      {/* URL Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 mb-6"
      >
        <div className="flex-1 relative gradient-border rounded-xl">
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 pr-12 bg-white border border-surface-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-transparent transition-colors shadow-sm"
          />
          <button
            onClick={handlePaste}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Paste from clipboard"
          >
            <ClipboardPaste size={16} />
          </button>
        </div>
        <button
          onClick={handleExtract}
          disabled={loading || !url.trim()}
          className="px-6 py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2 shrink-0 shadow-sm"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <FileText size={16} />
          )}
          Extract
        </button>
      </motion.div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={handleExtract}
                className="text-red-400 hover:text-red-600 transition-colors"
                title="Retry"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Skeleton */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex gap-4">
              <div className="w-48 h-28 bg-surface-100 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-surface-100 rounded-lg w-3/4 animate-pulse" />
                <div className="h-4 bg-surface-100 rounded-lg w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-surface-100 rounded-lg animate-pulse"
                  style={{ width: `${85 - i * 8}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Video Preview */}
            <div className="flex gap-4 mb-6 p-4 bg-white border border-surface-200 rounded-xl shadow-sm">
              <img
                src={data.thumbnail}
                alt={data.title}
                className="w-48 h-28 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-900 truncate mb-1">
                  {data.title}
                </h2>
                <p className="text-sm text-gray-500 mb-3">{data.author}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{data.segments.length} segments</span>
                  <span>{wordCount.toLocaleString()} words</span>
                  <a
                    href={`https://www.youtube.com/watch?v=${data.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-accent-500 hover:text-accent-700 transition-colors"
                  >
                    Watch <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Format Tabs + Actions */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex bg-surface-100 border border-surface-200 rounded-xl p-1">
                {FORMAT_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFormat(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      format === tab.id
                        ? 'text-accent-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {format === tab.id && (
                      <motion.div
                        layoutId="format-tab"
                        className="absolute inset-0 bg-white rounded-lg shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <tab.icon size={14} className="relative z-10" />
                    <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg transition-colors shadow-sm"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg transition-colors shadow-sm"
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>

            {/* Transcript Content */}
            <div className="relative bg-white border border-surface-200 rounded-xl overflow-hidden shadow-sm">
              <pre className="p-5 max-h-[500px] overflow-auto text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">
                {transcriptText}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
