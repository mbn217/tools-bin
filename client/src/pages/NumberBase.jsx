import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import SEO from '../components/SEO';

const BASES = [
  { id: 'bin', label: 'Binary', base: 2, prefix: '0b' },
  { id: 'oct', label: 'Octal', base: 8, prefix: '0o' },
  { id: 'dec', label: 'Decimal', base: 10, prefix: '' },
  { id: 'hex', label: 'Hexadecimal', base: 16, prefix: '0x' },
];

export default function NumberBase() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [copied, setCopied] = useState('');

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    const clean = input.trim().replace(/^0[bBxXoO]/, '');
    const num = parseInt(clean, fromBase);
    if (isNaN(num)) return null;
    return num;
  }, [input, fromBase]);

  const results = useMemo(() => {
    if (parsed === null) return {};
    return Object.fromEntries(BASES.map((b) => [b.id, parsed.toString(b.base).toUpperCase()]));
  }, [parsed]);

  async function handleCopy(id, val) {
    await navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <div className="max-w-4xl">
      <SEO title="Number Base Converter" description="Convert numbers between binary, octal, decimal, and hexadecimal. Free online number base converter with instant results." path="/number-base" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Number Base Converter</h1>
        <p className="text-gray-500 text-sm">Convert between binary, octal, decimal, and hexadecimal.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-2">Input</label>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter a number..." className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-800 font-mono focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">From</label>
            <select value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))} className="px-3 py-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-accent-400 shadow-sm">
              {BASES.map((b) => <option key={b.id} value={b.base}>{b.label}</option>)}
            </select>
          </div>
        </div>

        {parsed !== null && input.trim() && (
          <div className="space-y-2">
            {BASES.map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-3 bg-white border border-surface-200 rounded-xl shadow-sm group">
                <span className="text-xs font-medium text-gray-400 w-28 shrink-0">{b.label}</span>
                <code className="flex-1 text-sm font-mono text-gray-800 break-all">{b.prefix}{results[b.id]}</code>
                <button onClick={() => handleCopy(b.id, b.prefix + results[b.id])} className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                  {copied === b.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}

        {input.trim() && parsed === null && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">Invalid number for the selected base.</div>
        )}
      </motion.div>
    </div>
  );
}
