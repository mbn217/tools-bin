import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'sql-formatter';
import { Copy, Check, WrapText, Trash2, Download } from 'lucide-react';
import SEO from '../components/SEO';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [dialect, setDialect] = useState('sql');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function handleFormat() {
    setError('');
    try {
      setInput(format(input, { language: dialect, tabWidth: 2 }));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([input], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'query.sql';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="max-w-4xl">
      <SEO title="SQL Formatter" description="Format and beautify SQL queries online for free. Supports MySQL, PostgreSQL, SQLite, and more. Instant SQL formatting." path="/sql-formatter" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">SQL Formatter</h1>
        <p className="text-gray-500 text-sm">Beautify SQL queries with proper indentation and formatting.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button onClick={handleFormat} disabled={!input.trim()} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-40 transition-colors">
            <WrapText size={14} /> Format
          </button>
          <select value={dialect} onChange={(e) => setDialect(e.target.value)} className="px-2 py-1.5 bg-white border border-surface-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-accent-400">
            <option value="sql">Standard SQL</option>
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="sqlite">SQLite</option>
            <option value="transactsql">T-SQL</option>
          </select>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={handleCopy} disabled={!input.trim()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg shadow-sm disabled:opacity-40">
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={handleDownload} disabled={!input.trim()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg shadow-sm disabled:opacity-40">
              <Download size={14} /> .sql
            </button>
            <button onClick={() => { setInput(''); setError(''); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 bg-white border border-surface-200 rounded-lg shadow-sm">
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{error}</div>}

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SELECT * FROM users WHERE active = 1 ORDER BY created_at DESC"
          spellCheck={false}
          className="w-full h-[450px] p-5 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono leading-relaxed resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300"
        />
      </motion.div>
    </div>
  );
}
