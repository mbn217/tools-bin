import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import SEO from '../components/SEO';

function toWords(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

const converters = [
  { id: 'camel', label: 'camelCase', fn: (s) => { const w = toWords(s); return w.map((x, i) => i === 0 ? x.toLowerCase() : x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join(''); } },
  { id: 'pascal', label: 'PascalCase', fn: (s) => toWords(s).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') },
  { id: 'snake', label: 'snake_case', fn: (s) => toWords(s).map((w) => w.toLowerCase()).join('_') },
  { id: 'kebab', label: 'kebab-case', fn: (s) => toWords(s).map((w) => w.toLowerCase()).join('-') },
  { id: 'constant', label: 'CONSTANT_CASE', fn: (s) => toWords(s).map((w) => w.toUpperCase()).join('_') },
  { id: 'title', label: 'Title Case', fn: (s) => toWords(s).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') },
  { id: 'sentence', label: 'Sentence case', fn: (s) => { const w = toWords(s).join(' ').toLowerCase(); return w.charAt(0).toUpperCase() + w.slice(1); } },
  { id: 'upper', label: 'UPPERCASE', fn: (s) => s.toUpperCase() },
  { id: 'lower', label: 'lowercase', fn: (s) => s.toLowerCase() },
  { id: 'dot', label: 'dot.case', fn: (s) => toWords(s).map((w) => w.toLowerCase()).join('.') },
  { id: 'path', label: 'path/case', fn: (s) => toWords(s).map((w) => w.toLowerCase()).join('/') },
];

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  async function handleCopy(id, text) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <div className="max-w-4xl">
      <SEO title="Case Converter" description="Convert text between camelCase, snake_case, PascalCase, kebab-case, UPPERCASE, lowercase, Title Case, and more. Free online case converter." path="/case-converter" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Case Converter</h1>
        <p className="text-gray-500 text-sm">Convert text between different naming conventions instantly.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste text here..." className="w-full h-28 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300 mb-6" />
      </motion.div>

      {input.trim() && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {converters.map(({ id, label, fn }) => {
            const result = fn(input);
            return (
              <div key={id} className="flex items-center gap-3 p-3 bg-white border border-surface-200 rounded-xl shadow-sm group">
                <span className="text-xs font-medium text-gray-400 w-32 shrink-0">{label}</span>
                <code className="flex-1 text-sm font-mono text-gray-800 break-all">{result}</code>
                <button onClick={() => handleCopy(id, result)} className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                  {copied === id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
