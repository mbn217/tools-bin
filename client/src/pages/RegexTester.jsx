import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testStr, setTestStr] = useState('');

  const result = useMemo(() => {
    if (!pattern || !testStr) return { matches: [], error: null };
    try {
      const re = new RegExp(pattern, flags);
      const matches = [];
      let m;
      if (flags.includes('g')) {
        while ((m = re.exec(testStr)) !== null) {
          matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
          if (m.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        m = re.exec(testStr);
        if (m) matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
      }
      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: e.message };
    }
  }, [pattern, flags, testStr]);

  const highlighted = useMemo(() => {
    if (!pattern || !testStr || result.error || result.matches.length === 0) return null;
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const parts = [];
      let lastIdx = 0;
      let m;
      while ((m = re.exec(testStr)) !== null) {
        if (m.index > lastIdx) parts.push({ text: testStr.slice(lastIdx, m.index), match: false });
        parts.push({ text: m[0], match: true });
        lastIdx = m.index + m[0].length;
        if (m.index === re.lastIndex) re.lastIndex++;
      }
      if (lastIdx < testStr.length) parts.push({ text: testStr.slice(lastIdx), match: false });
      return parts;
    } catch { return null; }
  }, [pattern, flags, testStr, result]);

  const flagOptions = [
    { f: 'g', label: 'Global' },
    { f: 'i', label: 'Case insensitive' },
    { f: 'm', label: 'Multiline' },
    { f: 's', label: 'Dotall' },
  ];

  function toggleFlag(f) {
    setFlags((prev) => prev.includes(f) ? prev.replace(f, '') : prev + f);
  }

  return (
    <div className="max-w-4xl">
      <SEO title="Regex Tester" description="Test regular expressions online with live match highlighting and capture groups. Free regex debugger that runs in your browser." path="/regex-tester" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Regex Tester</h1>
        <p className="text-gray-500 text-sm">Test regular expressions with live highlighting and capture group display.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">/</span>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="w-full pl-7 pr-3 py-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-800 font-mono focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />
          </div>
          <div className="flex items-center gap-1 px-2 bg-white border border-surface-200 rounded-xl shadow-sm">
            {flagOptions.map(({ f, label }) => (
              <button key={f} onClick={() => toggleFlag(f)} title={label} className={`px-2 py-1 text-xs font-mono rounded-lg transition-colors ${flags.includes(f) ? 'bg-accent-50 text-accent-600 font-bold' : 'text-gray-400 hover:text-gray-600'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <textarea value={testStr} onChange={(e) => setTestStr(e.target.value)} placeholder="Enter test string..." className="w-full h-36 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />

        {result.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{result.error}</div>
        )}

        {highlighted && (
          <div className="p-4 bg-white border border-surface-200 rounded-xl shadow-sm">
            <label className="block text-xs font-medium text-gray-400 mb-2">Highlighted Matches</label>
            <div className="text-sm font-mono text-gray-700 whitespace-pre-wrap break-all leading-relaxed">
              {highlighted.map((p, i) =>
                p.match ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{p.text}</mark> : <span key={i}>{p.text}</span>
              )}
            </div>
          </div>
        )}

        {result.matches.length > 0 && (
          <div className="bg-white border border-surface-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-2 border-b border-surface-200 text-xs font-medium text-gray-400">
              {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
            </div>
            <div className="divide-y divide-surface-100 max-h-60 overflow-auto">
              {result.matches.map((m, i) => (
                <div key={i} className="px-4 py-2 flex items-start gap-3 text-xs">
                  <span className="text-gray-400 w-8 shrink-0">#{i + 1}</span>
                  <span className="font-mono text-gray-800 break-all">"{m.text}"</span>
                  <span className="text-gray-400 ml-auto shrink-0">idx {m.index}</span>
                  {m.groups.length > 0 && (
                    <span className="text-accent-500 shrink-0">groups: {m.groups.map((g, j) => `$${j + 1}="${g}"`).join(', ')}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
