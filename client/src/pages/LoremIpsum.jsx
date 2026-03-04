import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum perspiciatis unde omnis iste natus error voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis quasi architecto beatae vitae dicta explicabo nemo ipsam quia voluptas aspernatur aut odit fugit consequuntur magni dolores eos ratione sequi nesciunt neque porro quisquam dolorem adipisci numquam eius modi tempora corporis suscipit laboriosam'.split(' ');

function randomWord() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }

function generateSentence(minW = 6, maxW = 14) {
  const len = minW + Math.floor(Math.random() * (maxW - minW));
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateParagraph(minS = 3, maxS = 6) {
  const len = minS + Math.floor(Math.random() * (maxS - minS));
  return Array.from({ length: len }, () => generateSentence()).join(' ');
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState('paragraphs');
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    void seed;
    if (unit === 'paragraphs') return Array.from({ length: count }, () => generateParagraph()).join('\n\n');
    if (unit === 'sentences') return Array.from({ length: count }, () => generateSentence()).join(' ');
    return Array.from({ length: count }, randomWord).join(' ');
  }, [count, unit, seed]);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl">
      <SEO title="Lorem Ipsum Generator" description="Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Free online dummy text generator." path="/lorem-ipsum" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Lorem Ipsum Generator</h1>
        <p className="text-gray-500 text-sm">Generate placeholder text for your designs and prototypes.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex items-center gap-3 mb-6 flex-wrap">
        <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 px-3 py-2 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 text-center focus:outline-none focus:border-accent-400 shadow-sm" />
        <div className="flex bg-surface-100 border border-surface-200 rounded-xl p-1">
          {['paragraphs', 'sentences', 'words'].map((u) => (
            <button key={u} onClick={() => setUnit(u)} className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${unit === u ? 'text-accent-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {unit === u && <motion.div layoutId="lorem-unit" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              <span className="relative z-10 capitalize">{u}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setSeed((s) => s + 1)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-xl shadow-sm">
          <RefreshCw size={14} /> Regenerate
        </button>
        <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-xl shadow-sm ml-auto">
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
        </button>
      </motion.div>

      <div className="p-5 bg-white border border-surface-200 rounded-xl shadow-sm max-h-[500px] overflow-auto">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}
