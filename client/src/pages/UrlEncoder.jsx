import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowDownUp, Trash2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function handleConvert(text, dir) {
    setError('');
    try {
      setOutput(dir === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text));
    } catch {
      setError('Invalid input');
      setOutput('');
    }
  }

  function handleInputChange(e) {
    setInput(e.target.value);
    handleConvert(e.target.value, mode);
  }

  function toggleMode() {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setOutput('');
    setError('');
    handleConvert(input, newMode);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl">
      <SEO
        title="URL Encoder & Decoder"
        description="Encode or decode URL components online for free. Handles special characters, query strings, and Unicode. Runs in your browser."
        path="/url-encoder"
      />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">URL Encoder / Decoder</h1>
        <p className="text-gray-500 text-sm">Encode or decode URL components with special characters.</p>
      </motion.div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={toggleMode} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
          <ArrowDownUp size={14} />
          {mode === 'encode' ? 'Encoding' : 'Decoding'}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 bg-white border border-surface-200 rounded-lg transition-colors shadow-sm ml-auto">
          <Trash2 size={14} /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">{mode === 'encode' ? 'Plain Text / URL' : 'Encoded URL'}</label>
          <textarea value={input} onChange={handleInputChange} placeholder={mode === 'encode' ? 'Enter text or URL...' : 'Paste encoded URL...'} className="w-full h-48 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-400">{mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}</label>
            {output && (
              <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea value={error || output} readOnly className={`w-full h-48 p-4 bg-surface-50 border border-surface-200 rounded-xl text-sm font-mono resize-none focus:outline-none ${error ? 'text-red-500' : 'text-gray-700'}`} />
        </div>
      </div>
    </div>
  );
}
