import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowDownUp, Trash2 } from 'lucide-react';
import yaml from 'js-yaml';
import SEO from '../components/SEO';

export default function YamlJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('yaml-to-json');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function handleConvert() {
    setError('');
    try {
      if (mode === 'yaml-to-json') {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { indent: 2 }));
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
      <SEO title="YAML to JSON Converter" description="Convert YAML to JSON and JSON to YAML online for free. Validate and transform configuration files instantly." path="/yaml-json" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">YAML / JSON Converter</h1>
        <p className="text-gray-500 text-sm">Convert between YAML and JSON formats with validation.</p>
      </motion.div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => { setMode(mode === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json'); setOutput(''); setError(''); }} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
          <ArrowDownUp size={14} /> {mode === 'yaml-to-json' ? 'YAML → JSON' : 'JSON → YAML'}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 bg-white border border-surface-200 rounded-lg shadow-sm ml-auto">
          <Trash2 size={14} /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">{mode === 'yaml-to-json' ? 'YAML Input' : 'JSON Input'}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'yaml-to-json' ? 'name: Alice\nage: 30' : '{"name": "Alice"}'} className="w-full h-64 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-400">{mode === 'yaml-to-json' ? 'JSON Output' : 'YAML Output'}</label>
            {output && <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">{copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}</button>}
          </div>
          <textarea value={error || output} readOnly className={`w-full h-64 p-4 bg-surface-50 border border-surface-200 rounded-xl text-sm font-mono resize-none focus:outline-none ${error ? 'text-red-500' : 'text-gray-700'}`} />
        </div>
      </div>

      <button onClick={handleConvert} disabled={!input.trim()} className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        Convert
      </button>
    </div>
  );
}
