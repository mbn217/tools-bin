import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowDownUp, Trash2 } from 'lucide-react';
import SEO from '../components/SEO';

function csvToJson(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV needs at least a header row and one data row');
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
    return obj;
  });
}

function jsonToCsv(json) {
  const arr = JSON.parse(json);
  if (!Array.isArray(arr) || arr.length === 0) throw new Error('JSON must be a non-empty array of objects');
  const headers = Object.keys(arr[0]);
  const rows = arr.map((obj) => headers.map((h) => JSON.stringify(obj[h] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}

export default function CsvJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('csv-to-json');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function handleConvert() {
    setError('');
    try {
      if (mode === 'csv-to-json') {
        setOutput(JSON.stringify(csvToJson(input), null, 2));
      } else {
        setOutput(jsonToCsv(input));
      }
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl">
      <SEO title="CSV to JSON Converter" description="Convert CSV to JSON and JSON to CSV online for free. Paste your data and get instant results. No upload required." path="/csv-json" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">CSV / JSON Converter</h1>
        <p className="text-gray-500 text-sm">Convert between CSV and JSON formats.</p>
      </motion.div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => { setMode(mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json'); setOutput(''); setError(''); }} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
          <ArrowDownUp size={14} /> {mode === 'csv-to-json' ? 'CSV → JSON' : 'JSON → CSV'}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 bg-white border border-surface-200 rounded-lg shadow-sm ml-auto">
          <Trash2 size={14} /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">{mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'csv-to-json' ? 'name,age,city\nAlice,30,NYC' : '[{"name":"Alice","age":30}]'} className="w-full h-56 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-400">{mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}</label>
            {output && <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">{copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}</button>}
          </div>
          <textarea value={error || output} readOnly className={`w-full h-56 p-4 bg-surface-50 border border-surface-200 rounded-xl text-sm font-mono resize-none focus:outline-none ${error ? 'text-red-500' : 'text-gray-700'}`} />
        </div>
      </div>

      <button onClick={handleConvert} disabled={!input.trim()} className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        Convert
      </button>
    </div>
  );
}
