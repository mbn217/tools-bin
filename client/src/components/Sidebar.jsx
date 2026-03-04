import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, FileText, Code, Image, Hash, Clock, Palette,
  Binary, Link, KeyRound,
  Regex, Eye, GitCompareArrows, CaseSensitive, AlignLeft,
  Fingerprint, Lock, QrCode, PaintBucket,
  Table, FileJson, Calculator, Ruler,
  Timer, Database, Globe, Tags,
  ChevronLeft, ChevronRight, Wrench,
} from 'lucide-react';

const sections = [
  { label: null, items: [{ name: 'Home', path: '/', icon: Home }] },
  { label: 'Core Tools', items: [
    { name: 'YT Transcript', path: '/youtube-transcript', icon: FileText },
    { name: 'JSON Formatter', path: '/json-formatter', icon: Code },
    { name: 'Image Compressor', path: '/image-compressor', icon: Image },
    { name: 'Hash Generator', path: '/hash-generator', icon: Hash },
    { name: 'Timestamp', path: '/timestamp-converter', icon: Clock },
    { name: 'Color Picker', path: '/color-picker', icon: Palette },
  ]},
  { label: 'Encoding', items: [
    { name: 'Base64', path: '/base64', icon: Binary },
    { name: 'URL Encoder', path: '/url-encoder', icon: Link },
    { name: 'JWT Decoder', path: '/jwt-decoder', icon: KeyRound },
  ]},
  { label: 'Text & Code', items: [
    { name: 'Regex Tester', path: '/regex-tester', icon: Regex },
    { name: 'Markdown', path: '/markdown-preview', icon: Eye },
    { name: 'Text Diff', path: '/text-diff', icon: GitCompareArrows },
    { name: 'Case Converter', path: '/case-converter', icon: CaseSensitive },
    { name: 'Lorem Ipsum', path: '/lorem-ipsum', icon: AlignLeft },
  ]},
  { label: 'Generators', items: [
    { name: 'UUID', path: '/uuid-generator', icon: Fingerprint },
    { name: 'Password', path: '/password-generator', icon: Lock },
    { name: 'QR Code', path: '/qr-code', icon: QrCode },
    { name: 'CSS Gradient', path: '/css-gradient', icon: PaintBucket },
  ]},
  { label: 'Data Conversion', items: [
    { name: 'CSV / JSON', path: '/csv-json', icon: Table },
    { name: 'YAML / JSON', path: '/yaml-json', icon: FileJson },
    { name: 'Number Base', path: '/number-base', icon: Calculator },
    { name: 'Unit Converter', path: '/unit-converter', icon: Ruler },
  ]},
  { label: 'Dev Utilities', items: [
    { name: 'Cron Parser', path: '/cron-parser', icon: Timer },
    { name: 'SQL Formatter', path: '/sql-formatter', icon: Database },
    { name: 'HTTP Status', path: '/http-status', icon: Globe },
    { name: 'Meta Tags', path: '/meta-tag-generator', icon: Tags },
  ]},
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-white border-r border-surface-200 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 h-14 border-b border-surface-200 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50">
          <Wrench size={18} className="text-accent-500" />
        </div>
        {!collapsed && (
          <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-lg font-semibold tracking-tight text-gray-900 whitespace-nowrap">
            Tools Bin
          </motion.span>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-1">
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && !collapsed && (
              <div className="px-3 pt-4 pb-1">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{section.label}</span>
              </div>
            )}
            {section.label && collapsed && <div className="my-2 mx-3 border-t border-surface-200" />}
            {section.items.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative ${
                    isActive ? 'text-accent-600' : 'text-gray-500 hover:text-gray-800 hover:bg-surface-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg bg-accent-50"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon size={18} className="relative z-10 shrink-0" />
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-sm font-medium whitespace-nowrap">
                        {name}
                      </motion.span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 border-t border-surface-200 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
