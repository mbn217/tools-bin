import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, Eye, Edit3 } from 'lucide-react';
import { marked } from 'marked';
import SEO from '../components/SEO';

marked.setOptions({ breaks: true, gfm: true });

const SAMPLE = `# Hello World

This is a **Markdown** preview tool. Try editing this text!

## Features
- Live preview
- GitHub Flavored Markdown
- Export to HTML

> Blockquotes work too.

\`\`\`js
console.log("Hello!");
\`\`\`

| Name | Value |
|------|-------|
| Foo  | Bar   |
`;

export default function MarkdownPreview() {
  const [md, setMd] = useState(SAMPLE);
  const [view, setView] = useState('split');
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => marked.parse(md), [md]);

  async function handleCopyHtml() {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Markdown Export</title></head><body>${html}</body></html>`;
    const blob = new Blob([full], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="max-w-5xl">
      <SEO title="Markdown Preview" description="Write Markdown and see a live rendered preview. Export to HTML. Supports GitHub Flavored Markdown with tables, code blocks, and more." path="/markdown-preview" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Markdown Preview</h1>
        <p className="text-gray-500 text-sm">Write Markdown on the left, see rendered HTML on the right.</p>
      </motion.div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex bg-surface-100 border border-surface-200 rounded-xl p-1">
          {[{ id: 'split', label: 'Split', icon: Edit3 }, { id: 'preview', label: 'Preview', icon: Eye }].map((t) => (
            <button key={t.id} onClick={() => setView(t.id)} className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${view === t.id ? 'text-accent-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {view === t.id && <motion.div layoutId="md-view" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              <t.icon size={14} className="relative z-10" /><span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopyHtml} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg shadow-sm">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} {copied ? 'Copied HTML' : 'Copy HTML'}
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white border border-surface-200 rounded-lg shadow-sm">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className={`grid gap-4 ${view === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {view === 'split' && (
          <textarea value={md} onChange={(e) => setMd(e.target.value)} className="w-full h-[500px] p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 font-mono resize-none focus:outline-none focus:border-accent-400 shadow-sm" />
        )}
        <div className="h-[500px] overflow-auto p-5 bg-white border border-surface-200 rounded-xl shadow-sm prose prose-sm prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
