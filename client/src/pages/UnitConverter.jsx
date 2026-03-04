import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const CATEGORIES = {
  'CSS Length': { units: ['px', 'rem', 'em', 'pt', '%', 'vw', 'vh'], base: 'px', conversions: { px: 1, rem: 16, em: 16, pt: 1.333, '%': 0.16, vw: 0.01 * 1920 / 100 * 100, vh: 0.01 * 1080 / 100 * 100 } },
  'Data Size': { units: ['B', 'KB', 'MB', 'GB', 'TB'], base: 'B', conversions: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 } },
  'Temperature': { units: ['°C', '°F', 'K'], base: '°C', special: true },
  'Time': { units: ['ms', 's', 'min', 'hr', 'day'], base: 'ms', conversions: { ms: 1, s: 1000, min: 60000, hr: 3600000, day: 86400000 } },
  'Length': { units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'], base: 'mm', conversions: { mm: 1, cm: 10, m: 1000, km: 1000000, in: 25.4, ft: 304.8, yd: 914.4, mi: 1609344 } },
  'Weight': { units: ['mg', 'g', 'kg', 'oz', 'lb'], base: 'mg', conversions: { mg: 1, g: 1000, kg: 1000000, oz: 28349.5, lb: 453592 } },
};

function convert(value, fromUnit, toUnit, category) {
  if (category === 'Temperature') {
    let celsius;
    if (fromUnit === '°C') celsius = value;
    else if (fromUnit === '°F') celsius = (value - 32) * 5 / 9;
    else celsius = value - 273.15;
    if (toUnit === '°C') return celsius;
    if (toUnit === '°F') return celsius * 9 / 5 + 32;
    return celsius + 273.15;
  }
  const cat = CATEGORIES[category];
  const inBase = value * cat.conversions[fromUnit];
  return inBase / cat.conversions[toUnit];
}

export default function UnitConverter() {
  const [category, setCategory] = useState('CSS Length');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('px');

  const cat = CATEGORIES[category];

  const results = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    return cat.units.map((u) => ({ unit: u, value: convert(num, fromUnit, u, category) }));
  }, [value, fromUnit, category, cat]);

  function handleCategoryChange(c) {
    setCategory(c);
    setFromUnit(CATEGORIES[c].units[0]);
    setValue('1');
  }

  return (
    <div className="max-w-4xl">
      <SEO title="Unit Converter" description="Convert between CSS units (px, rem, em), data sizes (KB, MB, GB), temperature, time, length, and weight. Free online unit converter." path="/unit-converter" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Unit Converter</h1>
        <p className="text-gray-500 text-sm">Convert between CSS units, data sizes, temperature, time, length, and weight.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {Object.keys(CATEGORIES).map((c) => (
            <button key={c} onClick={() => handleCategoryChange(c)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${category === c ? 'bg-accent-50 border-accent-200 text-accent-700' : 'bg-white border-surface-200 text-gray-500 hover:text-gray-700'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-2">Value</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-800 font-mono focus:outline-none focus:border-accent-400 shadow-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">From</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="px-3 py-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-accent-400 shadow-sm">
              {cat.units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {results && (
          <div className="space-y-2">
            {results.map(({ unit, value: v }) => (
              <div key={unit} className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm ${unit === fromUnit ? 'bg-accent-50 border-accent-200' : 'bg-white border-surface-200'}`}>
                <span className="text-xs font-medium text-gray-400 w-16 shrink-0">{unit}</span>
                <code className="flex-1 text-sm font-mono text-gray-800">
                  {Number.isInteger(v) ? v : v.toFixed(6).replace(/\.?0+$/, '')}
                </code>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
