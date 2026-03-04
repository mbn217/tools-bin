import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw } from 'lucide-react';

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl({ r, g, b }) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }) {
  const sn = s / 100, ln = l / 100;
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hn = h / 360;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

function randomHex() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

function luminance({ r, g, b }) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export default function ColorPicker() {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState(hexToRgb('#6366f1'));
  const [hsl, setHsl] = useState(rgbToHsl(hexToRgb('#6366f1')));
  const [hexInput, setHexInput] = useState('#6366f1');
  const [copied, setCopied] = useState('');

  const updateFromHex = useCallback((h) => {
    const clean = h.replace('#', '').slice(0, 6);
    if (/^[0-9a-fA-F]{6}$/.test(clean)) {
      const fullHex = '#' + clean.toLowerCase();
      setHex(fullHex);
      const newRgb = hexToRgb(fullHex);
      setRgb(newRgb);
      setHsl(rgbToHsl(newRgb));
    }
  }, []);

  const updateFromRgb = useCallback((newRgb) => {
    const clamped = {
      r: Math.max(0, Math.min(255, newRgb.r)),
      g: Math.max(0, Math.min(255, newRgb.g)),
      b: Math.max(0, Math.min(255, newRgb.b)),
    };
    setRgb(clamped);
    const newHex = rgbToHex(clamped);
    setHex(newHex);
    setHexInput(newHex);
    setHsl(rgbToHsl(clamped));
  }, []);

  const updateFromHsl = useCallback((newHsl) => {
    const clamped = {
      h: Math.max(0, Math.min(360, newHsl.h)),
      s: Math.max(0, Math.min(100, newHsl.s)),
      l: Math.max(0, Math.min(100, newHsl.l)),
    };
    setHsl(clamped);
    const newRgb = hslToRgb(clamped);
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb);
    setHex(newHex);
    setHexInput(newHex);
  }, []);

  function handleRandom() {
    const h = randomHex();
    setHexInput(h);
    updateFromHex(h);
  }

  function handleColorInput(e) {
    const v = e.target.value;
    setHexInput(v);
    updateFromHex(v);
  }

  function handleNativePicker(e) {
    const v = e.target.value;
    setHexInput(v);
    updateFromHex(v);
  }

  async function handleCopy(key, value) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  }

  const textColor = luminance(rgb) > 0.5 ? '#1f2937' : '#ffffff';

  const formats = [
    { key: 'hex', label: 'HEX', value: hex.toUpperCase() },
    { key: 'rgb', label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { key: 'hsl', label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { key: 'rgba', label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
  ];

  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
          Color Picker
        </h1>
        <p className="text-gray-500 text-sm">
          Pick colors and convert between HEX, RGB, and HSL formats.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: preview + picker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-4"
        >
          {/* Color preview */}
          <div
            className="relative h-48 rounded-2xl shadow-sm border border-surface-200 flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: hex }}
          >
            <span className="text-lg font-mono font-bold" style={{ color: textColor }}>
              {hex.toUpperCase()}
            </span>
            <label className="absolute bottom-3 right-3 cursor-pointer">
              <input
                type="color"
                value={hex}
                onChange={handleNativePicker}
                className="w-8 h-8 rounded-lg cursor-pointer border-2 border-white/50"
              />
            </label>
          </div>

          {/* HEX input + random */}
          <div className="flex gap-2">
            <div className="flex-1 relative gradient-border rounded-xl">
              <input
                type="text"
                value={hexInput}
                onChange={handleColorInput}
                placeholder="#000000"
                maxLength={7}
                className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-800 font-mono focus:outline-none focus:border-transparent shadow-sm"
              />
            </div>
            <button
              onClick={handleRandom}
              className="flex items-center gap-1.5 px-4 py-3 bg-white border border-surface-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-surface-50 transition-colors shadow-sm"
            >
              <RefreshCw size={14} />
              Random
            </button>
          </div>

          {/* Format outputs */}
          <div className="space-y-2">
            {formats.map(({ key, label, value }) => (
              <div
                key={key}
                className="flex items-center gap-3 p-3 bg-white border border-surface-200 rounded-xl shadow-sm group"
              >
                <span className="text-xs font-semibold text-gray-400 w-12 shrink-0">
                  {label}
                </span>
                <span className="flex-1 text-sm font-mono text-gray-800">{value}</span>
                <button
                  onClick={() => handleCopy(key, value)}
                  className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copied === key ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: sliders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* RGB sliders */}
          <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">RGB</h3>
            {[
              { ch: 'r', label: 'Red', color: '#ef4444' },
              { ch: 'g', label: 'Green', color: '#22c55e' },
              { ch: 'b', label: 'Blue', color: '#3b82f6' },
            ].map(({ ch, label, color }) => (
              <div key={ch}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-gray-500">{label}</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[ch]}
                    onChange={(e) => updateFromRgb({ ...rgb, [ch]: parseInt(e.target.value) || 0 })}
                    className="w-14 text-right text-xs font-mono text-gray-700 bg-surface-50 border border-surface-200 rounded px-1.5 py-0.5 focus:outline-none focus:border-accent-400"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={(e) => updateFromRgb({ ...rgb, [ch]: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: color }}
                />
              </div>
            ))}
          </div>

          {/* HSL sliders */}
          <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">HSL</h3>
            {[
              { ch: 'h', label: 'Hue', max: 360, unit: '' },
              { ch: 's', label: 'Saturation', max: 100, unit: '%' },
              { ch: 'l', label: 'Lightness', max: 100, unit: '%' },
            ].map(({ ch, label, max, unit }) => (
              <div key={ch}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-gray-500">{label}</label>
                  <div className="flex items-center gap-0.5">
                    <input
                      type="number"
                      min={0}
                      max={max}
                      value={hsl[ch]}
                      onChange={(e) => updateFromHsl({ ...hsl, [ch]: parseInt(e.target.value) || 0 })}
                      className="w-14 text-right text-xs font-mono text-gray-700 bg-surface-50 border border-surface-200 rounded px-1.5 py-0.5 focus:outline-none focus:border-accent-400"
                    />
                    {unit && <span className="text-xs text-gray-400">{unit}</span>}
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={max}
                  value={hsl[ch]}
                  onChange={(e) => updateFromHsl({ ...hsl, [ch]: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-accent-500"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
