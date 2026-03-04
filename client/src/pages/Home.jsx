import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, FileText, Code, Image, Hash, Clock, Palette,
  Binary, Link, KeyRound,
  Regex, Eye, GitCompareArrows, CaseSensitive, AlignLeft,
  Fingerprint, Lock, QrCode, PaintBucket,
  Table, FileJson, Calculator, Ruler,
  Timer, Database, Globe, Tags,
} from 'lucide-react';
import ToolCard from '../components/ToolCard';
import SEO from '../components/SEO';

const categories = [
  {
    name: 'Core Tools',
    tools: [
      { name: 'YouTube Transcript', description: 'Extract transcripts from YouTube videos in multiple formats.', icon: FileText, path: '/youtube-transcript', color: '#ef4444' },
      { name: 'JSON Formatter', description: 'Beautify, minify, and validate JSON data.', icon: Code, path: '/json-formatter', color: '#f59e0b' },
      { name: 'Image Compressor', description: 'Compress and resize images in the browser.', icon: Image, path: '/image-compressor', color: '#10b981' },
      { name: 'Hash Generator', description: 'Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes.', icon: Hash, path: '/hash-generator', color: '#8b5cf6' },
      { name: 'Timestamp Converter', description: 'Convert between Unix timestamps and dates.', icon: Clock, path: '/timestamp-converter', color: '#06b6d4' },
      { name: 'Color Picker', description: 'Pick colors and convert between HEX, RGB, HSL.', icon: Palette, path: '/color-picker', color: '#ec4899' },
    ],
  },
  {
    name: 'Encoding & Decoding',
    tools: [
      { name: 'Base64', description: 'Encode and decode Base64 strings.', icon: Binary, path: '/base64', color: '#6366f1' },
      { name: 'URL Encoder', description: 'Encode and decode URL components.', icon: Link, path: '/url-encoder', color: '#0ea5e9' },
      { name: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens.', icon: KeyRound, path: '/jwt-decoder', color: '#f97316' },
    ],
  },
  {
    name: 'Text & Code',
    tools: [
      { name: 'Regex Tester', description: 'Test regex patterns with live match highlighting.', icon: Regex, path: '/regex-tester', color: '#ef4444' },
      { name: 'Markdown Preview', description: 'Write Markdown and see live rendered HTML.', icon: Eye, path: '/markdown-preview', color: '#8b5cf6' },
      { name: 'Text Diff', description: 'Compare two texts and highlight differences.', icon: GitCompareArrows, path: '/text-diff', color: '#10b981' },
      { name: 'Case Converter', description: 'Convert between camelCase, snake_case, and more.', icon: CaseSensitive, path: '/case-converter', color: '#f59e0b' },
      { name: 'Lorem Ipsum', description: 'Generate placeholder text for designs.', icon: AlignLeft, path: '/lorem-ipsum', color: '#64748b' },
    ],
  },
  {
    name: 'Generators',
    tools: [
      { name: 'UUID Generator', description: 'Generate random UUID v4 identifiers in bulk.', icon: Fingerprint, path: '/uuid-generator', color: '#6366f1' },
      { name: 'Password Generator', description: 'Generate strong, cryptographically random passwords.', icon: Lock, path: '/password-generator', color: '#ef4444' },
      { name: 'QR Code', description: 'Generate QR codes from text or URLs.', icon: QrCode, path: '/qr-code', color: '#1e293b' },
      { name: 'CSS Gradient', description: 'Design CSS gradients visually and copy the code.', icon: PaintBucket, path: '/css-gradient', color: '#ec4899' },
    ],
  },
  {
    name: 'Data Conversion',
    tools: [
      { name: 'CSV / JSON', description: 'Convert between CSV and JSON formats.', icon: Table, path: '/csv-json', color: '#10b981' },
      { name: 'YAML / JSON', description: 'Convert between YAML and JSON with validation.', icon: FileJson, path: '/yaml-json', color: '#f97316' },
      { name: 'Number Base', description: 'Convert between binary, octal, decimal, and hex.', icon: Calculator, path: '/number-base', color: '#6366f1' },
      { name: 'Unit Converter', description: 'Convert CSS units, data sizes, temperature, and more.', icon: Ruler, path: '/unit-converter', color: '#0ea5e9' },
    ],
  },
  {
    name: 'Developer Utilities',
    tools: [
      { name: 'Cron Parser', description: 'Parse cron expressions and see next runs.', icon: Timer, path: '/cron-parser', color: '#8b5cf6' },
      { name: 'SQL Formatter', description: 'Beautify SQL queries with proper indentation.', icon: Database, path: '/sql-formatter', color: '#06b6d4' },
      { name: 'HTTP Status', description: 'Searchable reference for HTTP status codes.', icon: Globe, path: '/http-status', color: '#f59e0b' },
      { name: 'Meta Tag Generator', description: 'Generate SEO meta tags for your website.', icon: Tags, path: '/meta-tag-generator', color: '#ef4444' },
    ],
  },
];

const allTools = categories.flatMap((c) => c.tools);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function Home() {
  const [search, setSearch] = useState('');

  const isSearching = search.trim().length > 0;
  const filtered = isSearching
    ? allTools.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div>
      <SEO
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Tools Bin',
          url: 'https://toolsbin.dev',
          description: 'A free collection of 26 developer tools — all in one place.',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Tools{' '}
          <span className="bg-gradient-to-r from-accent-500 to-purple-500 bg-clip-text text-transparent">Bin</span>
        </h1>
        <p className="text-gray-500 text-base">
          {allTools.length} free developer tools — all in one place.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-400 transition-colors shadow-sm gradient-border"
        />
      </motion.div>

      {isSearching ? (
        <>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tool) => (
              <motion.div key={tool.path} variants={item}>
                <ToolCard {...tool} />
              </motion.div>
            ))}
          </motion.div>
          {filtered.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 py-16 text-sm">
              No tools match your search.
            </motion.p>
          )}
        </>
      ) : (
        <div className="space-y-10">
          {categories.map((cat) => (
            <motion.section key={cat.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.35 }}>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{cat.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.tools.map((tool) => (
                  <ToolCard key={tool.path} {...tool} />
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  );
}
