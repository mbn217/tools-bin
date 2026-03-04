import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Code, Image, Hash, Clock, Palette } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import SEO from '../components/SEO';

const allTools = [
  {
    name: 'YouTube Transcript',
    description: 'Extract transcripts from YouTube videos in multiple formats — plain text, SRT, timestamped, or JSON.',
    icon: FileText,
    path: '/youtube-transcript',
    color: '#ef4444',
  },
  {
    name: 'JSON Formatter',
    description: 'Beautify, minify, and validate JSON data with syntax highlighting.',
    icon: Code,
    path: '/json-formatter',
    color: '#f59e0b',
  },
  {
    name: 'Image Compressor',
    description: 'Compress and resize images in the browser. Nothing leaves your machine.',
    icon: Image,
    path: '/image-compressor',
    color: '#10b981',
  },
  {
    name: 'Hash Generator',
    description: 'Generate SHA-1, SHA-256, SHA-384, and SHA-512 hash digests from text or files.',
    icon: Hash,
    path: '/hash-generator',
    color: '#8b5cf6',
  },
  {
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps, ISO dates, and human-readable formats.',
    icon: Clock,
    path: '/timestamp-converter',
    color: '#06b6d4',
  },
  {
    name: 'Color Picker',
    description: 'Pick colors and convert between HEX, RGB, HSL, and other color formats.',
    icon: Palette,
    path: '/color-picker',
    color: '#ec4899',
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function Home() {
  const [search, setSearch] = useState('');

  const filtered = allTools.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SEO
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Tools Bin',
          url: 'https://toolsbin.dev',
          description: 'A free collection of developer tools — YouTube transcript extractor, JSON formatter, image compressor, hash generator, timestamp converter, and color picker.',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Tools{' '}
          <span className="bg-gradient-to-r from-accent-500 to-purple-500 bg-clip-text text-transparent">
            Bin
          </span>
        </h1>
        <p className="text-gray-500 text-base">
          A collection of handy developer tools — all in one place.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8"
      >
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-400 transition-colors shadow-sm gradient-border"
        />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.map((tool) => (
          <motion.div key={tool.name} variants={item}>
            <ToolCard {...tool} />
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 py-16 text-sm"
        >
          No tools match your search.
        </motion.p>
      )}
    </div>
  );
}
