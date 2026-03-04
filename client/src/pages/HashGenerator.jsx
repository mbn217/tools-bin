import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, FileUp, Type, Trash2 } from 'lucide-react';

const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

async function digestText(text, algo) {
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function digestFile(file, algo) {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest(algo, buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function HashGenerator() {
  const [mode, setMode] = useState('text');
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [results, setResults] = useState({});
  const [computing, setComputing] = useState(false);
  const [copiedAlgo, setCopiedAlgo] = useState('');
  const fileRef = useRef(null);

  async function handleGenerate() {
    setComputing(true);
    setResults({});
    try {
      const hashes = {};
      for (const algo of ALGORITHMS) {
        hashes[algo] =
          mode === 'text'
            ? await digestText(input, algo)
            : await digestFile(file, algo);
      }
      setResults(hashes);
    } catch {
      setResults({ error: 'Failed to compute hashes' });
    } finally {
      setComputing(false);
    }
  }

  async function handleCopy(algo) {
    await navigator.clipboard.writeText(results[algo]);
    setCopiedAlgo(algo);
    setTimeout(() => setCopiedAlgo(''), 2000);
  }

  function handleClear() {
    setInput('');
    setFile(null);
    setResults({});
  }

  const canGenerate = mode === 'text' ? input.trim() : file;

  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
          Hash Generator
        </h1>
        <p className="text-gray-500 text-sm">
          Generate cryptographic hash digests from text or files using the Web Crypto API.
        </p>
      </motion.div>

      {/* Mode toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="flex bg-surface-100 border border-surface-200 rounded-xl p-1">
          {[
            { id: 'text', label: 'Text', icon: Type },
            { id: 'file', label: 'File', icon: FileUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setMode(tab.id); setResults({}); }}
              className={`relative flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                mode === tab.id ? 'text-accent-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {mode === tab.id && (
                <motion.div
                  layoutId="hash-mode"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon size={14} className="relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 bg-white border border-surface-200 rounded-lg transition-colors shadow-sm ml-auto"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        {mode === 'text' ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-36 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300"
          />
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 p-12 bg-white border-2 border-dashed border-surface-300 rounded-xl cursor-pointer hover:border-accent-300 transition-colors"
          >
            <FileUp size={28} className="text-gray-400" />
            <p className="text-sm text-gray-600">
              {file ? file.name : 'Click to select a file'}
            </p>
            {file && (
              <p className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            )}
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => { setFile(e.target.files[0]); setResults({}); }}
            />
          </div>
        )}
      </motion.div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate || computing}
        className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-6"
      >
        {computing ? 'Computing...' : 'Generate Hashes'}
      </button>

      {/* Results */}
      {Object.keys(results).length > 0 && !results.error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {ALGORITHMS.map((algo) => (
            <div
              key={algo}
              className="flex items-start gap-3 p-4 bg-white border border-surface-200 rounded-xl shadow-sm"
            >
              <span className="text-xs font-semibold text-gray-400 w-16 pt-0.5 shrink-0">
                {algo}
              </span>
              <code className="flex-1 text-xs text-gray-700 font-mono break-all leading-relaxed">
                {results[algo]}
              </code>
              <button
                onClick={() => handleCopy(algo)}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                {copiedAlgo === algo ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {results.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {results.error}
        </div>
      )}
    </div>
  );
}
