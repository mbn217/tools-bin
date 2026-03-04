import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Download,
  Trash2,
  WrapText,
  Minimize2,
  ClipboardPaste,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);

  const validation = useMemo(() => {
    if (!input.trim()) return { valid: null, error: null, parsed: null };
    try {
      const parsed = JSON.parse(input);
      return { valid: true, error: null, parsed };
    } catch (e) {
      return { valid: false, error: e.message, parsed: null };
    }
  }, [input]);

  function handleBeautify() {
    if (validation.parsed !== null) {
      setInput(JSON.stringify(validation.parsed, null, indentSize));
    }
  }

  function handleMinify() {
    if (validation.parsed !== null) {
      setInput(JSON.stringify(validation.parsed));
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {}
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([input], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
          JSON Formatter
        </h1>
        <p className="text-gray-500 text-sm">
          Beautify, minify, and validate JSON data.
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center justify-between mb-4 flex-wrap gap-3"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleBeautify}
            disabled={!validation.valid}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <WrapText size={14} />
            Beautify
          </button>
          <button
            onClick={handleMinify}
            disabled={!validation.valid}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 border border-surface-200 rounded-lg hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Minimize2 size={14} />
            Minify
          </button>

          <div className="flex items-center gap-1.5 ml-2 text-xs text-gray-500">
            <span>Indent:</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-surface-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-accent-400"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>Tab</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg transition-colors shadow-sm"
          >
            <ClipboardPaste size={14} />
            Paste
          </button>
          <button
            onClick={handleCopy}
            disabled={!input.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg transition-colors shadow-sm disabled:opacity-40"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!input.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg transition-colors shadow-sm disabled:opacity-40"
          >
            <Download size={14} />
            Download
          </button>
          <button
            onClick={() => setInput('')}
            disabled={!input}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 bg-white border border-surface-200 rounded-lg transition-colors shadow-sm disabled:opacity-40"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </motion.div>

      {/* Validation indicator */}
      {input.trim() && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          {validation.valid ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
              <CheckCircle2 size={14} />
              Valid JSON
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertCircle size={14} />
              {validation.error}
            </div>
          )}
        </motion.div>
      )}

      {/* Editor */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative bg-white border border-surface-200 rounded-xl overflow-hidden shadow-sm"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON here...\n\n{\n  "example": "value"\n}'
          spellCheck={false}
          className="w-full h-[500px] p-5 text-sm text-gray-700 font-mono leading-relaxed bg-transparent resize-none focus:outline-none placeholder-gray-300"
        />
        {input.trim() && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {input.length.toLocaleString()} chars
          </div>
        )}
      </motion.div>
    </div>
  );
}
