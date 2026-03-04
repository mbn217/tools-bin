import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import cronstrue from 'cronstrue';
import { Copy, Check } from 'lucide-react';
import SEO from '../components/SEO';

const PRESETS = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Every day at midnight', cron: '0 0 * * *' },
  { label: 'Every Monday at 9am', cron: '0 9 * * 1' },
  { label: 'Every 1st of month', cron: '0 0 1 * *' },
  { label: 'Every 15 minutes', cron: '*/15 * * * *' },
];

function getNextRuns(cron, count = 5) {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return [];
  const runs = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);

  const match = (val, field, min, max) => {
    if (val === '*') return true;
    if (val.includes('/')) { const step = parseInt(val.split('/')[1]); return field % step === 0; }
    if (val.includes(',')) return val.split(',').map(Number).includes(field);
    if (val.includes('-')) { const [a, b] = val.split('-').map(Number); return field >= a && field <= b; }
    return parseInt(val) === field;
  };

  for (let i = 0; i < 525600 && runs.length < count; i++) {
    if (
      match(parts[0], d.getMinutes(), 0, 59) &&
      match(parts[1], d.getHours(), 0, 23) &&
      match(parts[2], d.getDate(), 1, 31) &&
      match(parts[3], d.getMonth() + 1, 1, 12) &&
      match(parts[4], d.getDay(), 0, 6)
    ) {
      runs.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return runs;
}

export default function CronParser() {
  const [cron, setCron] = useState('0 9 * * 1-5');
  const [copied, setCopied] = useState(false);

  const description = useMemo(() => {
    try { return cronstrue.toString(cron); } catch { return null; }
  }, [cron]);

  const nextRuns = useMemo(() => {
    try { return getNextRuns(cron); } catch { return []; }
  }, [cron]);

  async function handleCopy() {
    await navigator.clipboard.writeText(cron);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl">
      <SEO title="Cron Expression Parser" description="Parse cron expressions into human-readable descriptions. See the next scheduled run times. Free online cron job debugger." path="/cron-parser" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Cron Expression Parser</h1>
        <p className="text-gray-500 text-sm">Parse cron expressions and see the next scheduled runs.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
        <div className="flex gap-2">
          <input type="text" value={cron} onChange={(e) => setCron(e.target.value)} placeholder="* * * * *" className="flex-1 px-4 py-3 bg-white border border-surface-200 rounded-xl text-lg text-gray-800 font-mono text-center focus:outline-none focus:border-accent-400 shadow-sm tracking-widest placeholder-gray-300" />
          <button onClick={handleCopy} className="px-3 text-gray-400 hover:text-gray-600 transition-colors">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 justify-center font-mono">
          <span>minute</span><span>·</span><span>hour</span><span>·</span><span>day</span><span>·</span><span>month</span><span>·</span><span>weekday</span>
        </div>

        {description && (
          <div className="p-4 bg-accent-50 border border-accent-200 rounded-xl text-center">
            <p className="text-sm font-medium text-accent-700">{description}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.cron} onClick={() => setCron(p.cron)} className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${cron === p.cron ? 'bg-accent-50 border-accent-200 text-accent-700' : 'bg-white border-surface-200 text-gray-500 hover:text-gray-700'}`}>
              {p.label}
            </button>
          ))}
        </div>

        {nextRuns.length > 0 && (
          <div className="bg-white border border-surface-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-2 border-b border-surface-200 text-xs font-medium text-gray-400">Next {nextRuns.length} Runs</div>
            <div className="divide-y divide-surface-100">
              {nextRuns.map((d, i) => (
                <div key={i} className="px-4 py-2 flex items-center gap-3 text-sm">
                  <span className="text-gray-400 w-6 shrink-0">#{i + 1}</span>
                  <span className="font-mono text-gray-800">{d.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
