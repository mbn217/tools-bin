import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, Trash2 } from 'lucide-react';
import SEO from '../components/SEO';

function uuidv4() {
  return crypto.randomUUID();
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState(() => [uuidv4()]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const [copied, setCopied] = useState('');

  const generate = useCallback(() => {
    setUuids(Array.from({ length: count }, uuidv4));
  }, [count]);

  const format = (u) => {
    let r = noDashes ? u.replace(/-/g, '') : u;
    return uppercase ? r.toUpperCase() : r;
  };

  async function handleCopy(idx) {
    await navigator.clipboard.writeText(format(uuids[idx]));
    setCopied(String(idx));
    setTimeout(() => setCopied(''), 2000);
  }

  async function handleCopyAll() {
    await navigator.clipboard.writeText(uuids.map(format).join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <div className="max-w-4xl">
      <SEO title="UUID Generator" description="Generate random UUID v4 identifiers in bulk. Options for uppercase and no-dash formats. Free online UUID generator." path="/uuid-generator" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">UUID Generator</h1>
        <p className="text-gray-500 text-sm">Generate random UUID v4 identifiers.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex items-center gap-3 mb-6 flex-wrap">
        <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} className="w-20 px-3 py-2 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 text-center focus:outline-none focus:border-accent-400 shadow-sm" />
        <button onClick={generate} className="flex items-center gap-1.5 px-5 py-2 bg-accent-500 text-white text-sm font-medium rounded-xl hover:bg-accent-600 transition-colors">
          <RefreshCw size={14} /> Generate
        </button>
        <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-accent-500" /> Uppercase
        </label>
        <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
          <input type="checkbox" checked={noDashes} onChange={(e) => setNoDashes(e.target.checked)} className="accent-accent-500" /> No dashes
        </label>
        {uuids.length > 1 && (
          <button onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-xl shadow-sm ml-auto">
            {copied === 'all' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} {copied === 'all' ? 'Copied all' : 'Copy all'}
          </button>
        )}
      </motion.div>

      <div className="space-y-2">
        {uuids.map((u, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white border border-surface-200 rounded-xl shadow-sm group">
            <code className="flex-1 text-sm font-mono text-gray-800 break-all">{format(u)}</code>
            <button onClick={() => handleCopy(i)} className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
              {copied === String(i) ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
