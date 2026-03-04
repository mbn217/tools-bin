import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, ArrowDownUp } from 'lucide-react';

function formatParts(d) {
  return {
    iso: d.toISOString(),
    utc: d.toUTCString(),
    local: d.toLocaleString(),
    date: d.toLocaleDateString('en-CA'),
    time: d.toLocaleTimeString('en-US', { hour12: false }),
    relative: getRelative(d),
    unix: Math.floor(d.getTime() / 1000),
    unixMs: d.getTime(),
  };
}

function getRelative(d) {
  const diff = Date.now() - d.getTime();
  const abs = Math.abs(diff);
  const future = diff < 0;
  const suffix = future ? 'from now' : 'ago';

  if (abs < 60_000) return 'just now';
  if (abs < 3_600_000) {
    const m = Math.floor(abs / 60_000);
    return `${m} minute${m > 1 ? 's' : ''} ${suffix}`;
  }
  if (abs < 86_400_000) {
    const h = Math.floor(abs / 3_600_000);
    return `${h} hour${h > 1 ? 's' : ''} ${suffix}`;
  }
  const days = Math.floor(abs / 86_400_000);
  if (days < 365) return `${days} day${days > 1 ? 's' : ''} ${suffix}`;
  const y = Math.floor(days / 365);
  return `${y} year${y > 1 ? 's' : ''} ${suffix}`;
}

export default function TimestampConverter() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');
  const [liveNow, setLiveNow] = useState(formatParts(new Date()));
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setLiveNow(formatParts(new Date())), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConvert = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) { setParsed(null); setError(''); return; }

    let date;

    if (/^\d{10}$/.test(trimmed)) {
      date = new Date(parseInt(trimmed) * 1000);
    } else if (/^\d{13}$/.test(trimmed)) {
      date = new Date(parseInt(trimmed));
    } else {
      date = new Date(trimmed);
    }

    if (isNaN(date.getTime())) {
      setError('Could not parse this input. Try a Unix timestamp, ISO string, or date string.');
      setParsed(null);
    } else {
      setParsed(formatParts(date));
      setError('');
    }
  }, [input]);

  useEffect(() => {
    const timer = setTimeout(handleConvert, 300);
    return () => clearTimeout(timer);
  }, [input, handleConvert]);

  function setNow() {
    setInput(String(Math.floor(Date.now() / 1000)));
  }

  async function handleCopy(key, value) {
    await navigator.clipboard.writeText(String(value));
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  const rows = parsed
    ? [
        { label: 'Unix (seconds)', key: 'unix', value: parsed.unix },
        { label: 'Unix (milliseconds)', key: 'unixMs', value: parsed.unixMs },
        { label: 'ISO 8601', key: 'iso', value: parsed.iso },
        { label: 'UTC String', key: 'utc', value: parsed.utc },
        { label: 'Local Time', key: 'local', value: parsed.local },
        { label: 'Date', key: 'date', value: parsed.date },
        { label: 'Time', key: 'time', value: parsed.time },
        { label: 'Relative', key: 'relative', value: parsed.relative },
      ]
    : [];

  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
          Timestamp Converter
        </h1>
        <p className="text-gray-500 text-sm">
          Convert between Unix timestamps, ISO dates, and human-readable formats.
        </p>
      </motion.div>

      {/* Live clock */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-4 mb-6 p-4 bg-white border border-surface-200 rounded-xl shadow-sm"
      >
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-400 mb-1">Current Time</p>
          <p className="text-sm font-mono text-gray-800">{liveNow.iso}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-gray-400 mb-1">Unix</p>
          <p className="text-sm font-mono text-gray-800">{liveNow.unix}</p>
        </div>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        <div className="flex-1 relative gradient-border rounded-xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a timestamp, ISO date, or date string..."
            className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-transparent shadow-sm font-mono"
          />
        </div>
        <button
          onClick={setNow}
          className="flex items-center gap-1.5 px-4 py-3 bg-white border border-surface-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-surface-50 transition-colors shadow-sm shrink-0"
        >
          <RefreshCw size={14} />
          Now
        </button>
      </motion.div>

      {/* Hint */}
      {!input.trim() && !parsed && (
        <div className="mb-6 text-xs text-gray-400 space-y-1">
          <p>Accepted inputs:</p>
          <div className="flex flex-wrap gap-2">
            {['1709251200', '1709251200000', '2024-03-01T00:00:00Z', 'March 1, 2024'].map((ex) => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="px-2 py-1 bg-surface-100 border border-surface-200 rounded-lg font-mono hover:border-accent-300 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700"
        >
          {error}
        </motion.div>
      )}

      {/* Results */}
      {parsed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {rows.map(({ label, key, value }) => (
            <div
              key={key}
              className="flex items-center gap-3 p-3 bg-white border border-surface-200 rounded-xl shadow-sm group"
            >
              <span className="text-xs font-medium text-gray-400 w-36 shrink-0">
                {label}
              </span>
              <span className="flex-1 text-sm font-mono text-gray-800 break-all">
                {String(value)}
              </span>
              <button
                onClick={() => handleCopy(key, value)}
                className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              >
                {copied === key ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
