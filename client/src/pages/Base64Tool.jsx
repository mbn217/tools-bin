import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowDownUp, Trash2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function handleConvert(text, dir) {
    setError('');
    try {
      if (dir === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch {
      setError(dir === 'encode' ? 'Failed to encode' : 'Invalid Base64 string');
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
        title="Base64 Encoder & Decoder"
        description="Encode text to Base64 or decode Base64 strings online for free. Instant, private, and runs entirely in your browser."
        path="/base64"
      />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Base64 Encoder / Decoder</h1>
        <p className="text-gray-500 text-sm">Encode text to Base64 or decode Base64 strings instantly.</p>
      </motion.div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={toggleMode}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          <ArrowDownUp size={14} />
          {mode === 'encode' ? 'Encoding' : 'Decoding'}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 bg-white border border-surface-200 rounded-lg transition-colors shadow-sm ml-auto">
          <Trash2 size={14} /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">{mode === 'encode' ? 'Plain Text' : 'Base64 String'}</label>
          <textarea value={input} onChange={handleInputChange} placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string...'} className="w-full h-64 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-400">{mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}</label>
            {output && (
              <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea value={error || output} readOnly className={`w-full h-64 p-4 bg-surface-50 border border-surface-200 rounded-xl text-sm font-mono resize-none focus:outline-none ${error ? 'text-red-500' : 'text-gray-700'}`} />
        </div>
      </div>
    </div>
  );
}
