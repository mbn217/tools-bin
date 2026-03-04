import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import SEO from '../components/SEO';

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    const lines = [];
    lines.push('<meta charset="UTF-8" />');
    lines.push('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    if (title) lines.push(`<title>${title}</title>`);
    if (description) lines.push(`<meta name="description" content="${description}" />`);
    if (keywords) lines.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) lines.push(`<meta name="author" content="${author}" />`);
    lines.push('<meta name="robots" content="index, follow" />');
    if (url) lines.push(`<link rel="canonical" href="${url}" />`);
    lines.push('');
    lines.push('<!-- Open Graph -->');
    if (title) lines.push(`<meta property="og:title" content="${title}" />`);
    if (description) lines.push(`<meta property="og:description" content="${description}" />`);
    lines.push('<meta property="og:type" content="website" />');
    if (url) lines.push(`<meta property="og:url" content="${url}" />`);
    if (image) lines.push(`<meta property="og:image" content="${image}" />`);
    lines.push('');
    lines.push('<!-- Twitter Card -->');
    lines.push('<meta name="twitter:card" content="summary_large_image" />');
    if (title) lines.push(`<meta name="twitter:title" content="${title}" />`);
    if (description) lines.push(`<meta name="twitter:description" content="${description}" />`);
    if (image) lines.push(`<meta name="twitter:image" content="${image}" />`);
    if (twitterHandle) lines.push(`<meta name="twitter:site" content="${twitterHandle}" />`);
    return lines.join('\n');
  }, [title, description, keywords, author, url, image, twitterHandle]);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const fields = [
    { label: 'Page Title', value: title, set: setTitle, placeholder: 'My Awesome Website', hint: `${title.length}/60 chars` },
    { label: 'Description', value: description, set: setDescription, placeholder: 'A brief description of your page...', hint: `${description.length}/160 chars`, textarea: true },
    { label: 'Keywords', value: keywords, set: setKeywords, placeholder: 'react, tools, developer' },
    { label: 'Author', value: author, set: setAuthor, placeholder: 'John Doe' },
    { label: 'Canonical URL', value: url, set: setUrl, placeholder: 'https://example.com/page' },
    { label: 'OG Image URL', value: image, set: setImage, placeholder: 'https://example.com/og.png' },
    { label: 'Twitter Handle', value: twitterHandle, set: setTwitterHandle, placeholder: '@yourhandle' },
  ];

  return (
    <div className="max-w-4xl">
      <SEO title="Meta Tag Generator" description="Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Fill in a form and copy the ready-to-use HTML code." path="/meta-tag-generator" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Meta Tag Generator</h1>
        <p className="text-gray-500 text-sm">Fill in the form and get copy-paste-ready HTML meta tags.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
          {fields.map((f) => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-500">{f.label}</label>
                {f.hint && <span className="text-xs text-gray-400">{f.hint}</span>}
              </div>
              {f.textarea ? (
                <textarea value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} className="w-full h-20 p-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />
              ) : (
                <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} className="w-full px-3 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />
              )}
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-400">Generated HTML</label>
            <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 bg-surface-50 border border-surface-200 rounded-xl text-xs text-gray-700 font-mono overflow-auto max-h-[520px] leading-relaxed whitespace-pre-wrap">{code}</pre>
        </motion.div>
      </div>
    </div>
  );
}
