import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: 'Weak', color: '#ef4444', pct: 25 };
  if (score <= 3) return { label: 'Fair', color: '#f59e0b', pct: 50 };
  if (score <= 4) return { label: 'Good', color: '#22c55e', pct: 75 };
  return { label: 'Strong', color: '#10b981', pct: 100 };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = '';
    Object.entries(options).forEach(([k, v]) => { if (v) chars += CHARSETS[k]; });
    if (!chars) { setPassword(''); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, (n) => chars[n % chars.length]).join(''));
  }, [length, options]);

  useEffect(() => { generate(); }, [generate]);

  const strength = password ? calcStrength(password) : null;

  async function handleCopy() {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl">
      <SEO title="Password Generator" description="Generate strong, random passwords with customizable length and character sets. Uses cryptographic randomness. Free and private." path="/password-generator" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Password Generator</h1>
        <p className="text-gray-500 text-sm">Generate strong, cryptographically random passwords.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-2 p-4 bg-white border border-surface-200 rounded-xl shadow-sm mb-4">
          <code className="flex-1 text-lg font-mono text-gray-800 break-all select-all">{password || 'Select at least one character set'}</code>
          <button onClick={handleCopy} disabled={!password} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30 shrink-0">
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
          <button onClick={generate} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <RefreshCw size={18} />
          </button>
        </div>

        {strength && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Strength</span>
              <span className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</span>
            </div>
            <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${strength.pct}%` }} className="h-full rounded-full" style={{ backgroundColor: strength.color }} />
            </div>
          </div>
        )}

        <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-500">Length: {length}</label>
            </div>
            <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-accent-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.keys(CHARSETS).map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={options[key]} onChange={(e) => setOptions({ ...options, [key]: e.target.checked })} className="accent-accent-500" />
                <span className="text-sm text-gray-700 capitalize">{key}</span>
                <span className="text-xs text-gray-400 font-mono">{CHARSETS[key].slice(0, 6)}...</span>
              </label>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
