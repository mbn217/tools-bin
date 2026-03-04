import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

function decodeJwt(token) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('JWT must have 3 parts separated by dots');
  const decode = (s) => JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/')));
  return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] };
}

function formatExp(exp) {
  if (!exp) return null;
  const d = new Date(exp * 1000);
  const now = Date.now();
  const expired = d.getTime() < now;
  return { date: d.toLocaleString(), expired };
}

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState('');

  const result = useMemo(() => {
    if (!token.trim()) return null;
    try {
      return { ...decodeJwt(token), error: null };
    } catch (e) {
      return { header: null, payload: null, signature: null, error: e.message };
    }
  }, [token]);

  const expInfo = result?.payload ? formatExp(result.payload.exp) : null;

  async function handleCopy(key, value) {
    await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  return (
    <div className="max-w-4xl">
      <SEO
        title="JWT Decoder"
        description="Decode JSON Web Tokens (JWT) online. View the header, payload, and expiration without any secret key. Free and private."
        path="/jwt-decoder"
      />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">JWT Decoder</h1>
        <p className="text-gray-500 text-sm">Paste a JSON Web Token to inspect its header, payload, and expiration.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here (eyJhbGciOi...)"
          className="w-full h-28 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300 mb-6"
        />
      </motion.div>

      {result?.error && (
        <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          <AlertCircle size={14} /> {result.error}
        </div>
      )}

      {result && !result.error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {expInfo && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-xs border ${expInfo.expired ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
              {expInfo.expired ? <AlertCircle size={14} /> : <Check size={14} />}
              {expInfo.expired ? 'Expired' : 'Valid'} — Expires: {expInfo.date}
            </div>
          )}

          {[{ key: 'header', label: 'Header', data: result.header }, { key: 'payload', label: 'Payload', data: result.payload }].map(({ key, label, data }) => (
            <div key={key} className="bg-white border border-surface-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-surface-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
                <button onClick={() => handleCopy(key, data)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  {copied === key ? <Check size={12} className="text-green-500" /> : <Copy size={12} />} {copied === key ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 text-sm text-gray-700 font-mono overflow-auto">{JSON.stringify(data, null, 2)}</pre>
            </div>
          ))}

          <div className="bg-white border border-surface-200 rounded-xl shadow-sm p-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Signature</span>
            <p className="mt-2 text-xs text-gray-500 font-mono break-all">{result.signature}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
