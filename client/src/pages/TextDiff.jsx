import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { diffLines, diffWords } from 'diff';
import SEO from '../components/SEO';

export default function TextDiff() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [mode, setMode] = useState('lines');

  const diffs = useMemo(() => {
    if (!textA && !textB) return [];
    return mode === 'lines' ? diffLines(textA, textB) : diffWords(textA, textB);
  }, [textA, textB, mode]);

  const stats = useMemo(() => {
    let added = 0, removed = 0;
    diffs.forEach((d) => {
      if (d.added) added += d.count || 0;
      if (d.removed) removed += d.count || 0;
    });
    return { added, removed };
  }, [diffs]);

  return (
    <div className="max-w-5xl">
      <SEO title="Text Diff Checker" description="Compare two texts side by side and highlight the differences. Line-by-line or word-by-word diff. Free online diff tool." path="/text-diff" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Text Diff Checker</h1>
        <p className="text-gray-500 text-sm">Paste two texts and see the differences highlighted.</p>
      </motion.div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex bg-surface-100 border border-surface-200 rounded-xl p-1">
          {['lines', 'words'].map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${mode === m ? 'text-accent-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {mode === m && <motion.div layoutId="diff-mode" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              <span className="relative z-10 capitalize">{m}</span>
            </button>
          ))}
        </div>
        {(textA || textB) && (
          <div className="flex items-center gap-3 ml-auto text-xs">
            <span className="text-green-600">+{stats.added} added</span>
            <span className="text-red-600">-{stats.removed} removed</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Original</label>
          <textarea value={textA} onChange={(e) => setTextA(e.target.value)} placeholder="Paste original text..." className="w-full h-48 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Modified</label>
          <textarea value={textB} onChange={(e) => setTextB(e.target.value)} placeholder="Paste modified text..." className="w-full h-48 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />
        </div>
      </div>

      {diffs.length > 0 && (textA || textB) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-white border border-surface-200 rounded-xl shadow-sm overflow-auto max-h-[400px]">
          <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
            {diffs.map((part, i) => (
              <span key={i} className={part.added ? 'bg-green-100 text-green-800' : part.removed ? 'bg-red-100 text-red-800 line-through' : 'text-gray-700'}>
                {part.value}
              </span>
            ))}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
