import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Plus, X, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

export default function CssGradient() {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([
    { color: '#6366f1', pos: 0 },
    { color: '#ec4899', pos: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const gradientStr = type === 'linear'
    ? `linear-gradient(${angle}deg, ${stops.map((s) => `${s.color} ${s.pos}%`).join(', ')})`
    : `radial-gradient(circle, ${stops.map((s) => `${s.color} ${s.pos}%`).join(', ')})`;

  const cssCode = `background: ${gradientStr};`;

  function updateStop(i, field, val) {
    setStops((prev) => prev.map((s, j) => j === i ? { ...s, [field]: val } : s));
  }

  function addStop() {
    setStops((prev) => [...prev, { color: randomColor(), pos: 50 }]);
  }

  function removeStop(i) {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((_, j) => j !== i));
  }

  function randomize() {
    setStops([{ color: randomColor(), pos: 0 }, { color: randomColor(), pos: 100 }]);
    setAngle(Math.floor(Math.random() * 360));
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl">
      <SEO title="CSS Gradient Generator" description="Create beautiful CSS gradients visually. Linear and radial gradients with customizable colors, angles, and stops. Copy the CSS code instantly." path="/css-gradient" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">CSS Gradient Generator</h1>
        <p className="text-gray-500 text-sm">Design gradients visually and copy the CSS.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="h-48 rounded-2xl border border-surface-200 shadow-sm mb-6" style={{ background: gradientStr }} />

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex bg-surface-100 border border-surface-200 rounded-xl p-1">
            {['linear', 'radial'].map((t) => (
              <button key={t} onClick={() => setType(t)} className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${type === t ? 'text-accent-700' : 'text-gray-500 hover:text-gray-700'}`}>
                {type === t && <motion.div layoutId="grad-type" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                <span className="relative z-10 capitalize">{t}</span>
              </button>
            ))}
          </div>
          {type === 'linear' && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Angle:</label>
              <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-24 accent-accent-500" />
              <span className="text-xs text-gray-500 font-mono w-8">{angle}°</span>
            </div>
          )}
          <button onClick={addStop} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg shadow-sm"><Plus size={14} /> Add Stop</button>
          <button onClick={randomize} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg shadow-sm"><RefreshCw size={14} /> Random</button>
        </div>

        <div className="space-y-3 mb-6">
          {stops.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white border border-surface-200 rounded-xl shadow-sm">
              <input type="color" value={s.color} onChange={(e) => updateStop(i, 'color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
              <span className="text-xs font-mono text-gray-500 w-16">{s.color}</span>
              <input type="range" min={0} max={100} value={s.pos} onChange={(e) => updateStop(i, 'pos', Number(e.target.value))} className="flex-1 accent-accent-500" />
              <span className="text-xs text-gray-500 w-8">{s.pos}%</span>
              {stops.length > 2 && (
                <button onClick={() => removeStop(i)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={14} /></button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 p-4 bg-surface-50 border border-surface-200 rounded-xl">
          <code className="flex-1 text-sm font-mono text-gray-700 break-all">{cssCode}</code>
          <button onClick={handleCopy} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
