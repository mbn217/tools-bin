import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';
import SEO from '../components/SEO';

export default function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const canvasRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!text.trim() || !canvasRef.current) return;
    setError('');
    QRCode.toCanvas(canvasRef.current, text, { width: size, color: { dark: fgColor, light: '#ffffff' }, margin: 2 }, (err) => {
      if (err) setError('Failed to generate QR code');
    });
  }, [text, size, fgColor]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'qrcode.png';
    a.click();
  }

  return (
    <div className="max-w-4xl">
      <SEO title="QR Code Generator" description="Generate QR codes from any text or URL. Customize size and color. Download as PNG. Free online QR code maker." path="/qr-code" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">QR Code Generator</h1>
        <p className="text-gray-500 text-sm">Turn any text or URL into a QR code.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or URL..." className="w-full h-32 p-4 bg-white border border-surface-200 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300" />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-surface-200 rounded-xl p-4 shadow-sm">
              <label className="block text-xs font-medium text-gray-500 mb-2">Size: {size}px</label>
              <input type="range" min={128} max={512} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-accent-500" />
            </div>
            <div className="bg-white border border-surface-200 rounded-xl p-4 shadow-sm">
              <label className="block text-xs font-medium text-gray-500 mb-2">Color</label>
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
            </div>
          </div>

          {text.trim() && (
            <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2 bg-accent-500 text-white text-sm font-medium rounded-xl hover:bg-accent-600 transition-colors">
              <Download size={16} /> Download PNG
            </button>
          )}
        </motion.div>

        <div className="flex items-center justify-center">
          <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-sm">
            {text.trim() ? (
              <canvas ref={canvasRef} />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-gray-300 text-sm">Enter text to generate</div>
            )}
          </div>
        </div>
      </div>
      {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{error}</div>}
    </div>
  );
}
