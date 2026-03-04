import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Download,
  Trash2,
  ImageIcon,
  ArrowRight,
} from 'lucide-react';

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function compressImage(file, quality, maxWidth, format) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (maxWidth && width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          resolve({
            blob,
            width,
            height,
            url: URL.createObjectURL(blob),
          });
        },
        `image/${format}`,
        quality / 100
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState('');
  const [format, setFormat] = useState('jpeg');
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  }, []);

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  async function handleCompress() {
    if (!file) return;
    setProcessing(true);
    try {
      const res = await compressImage(
        file,
        quality,
        maxWidth ? parseInt(maxWidth) : 0,
        format
      );
      setResult(res);
    } finally {
      setProcessing(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const ext = format === 'jpeg' ? 'jpg' : format;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `compressed.${ext}`;
    a.click();
  }

  function handleClear() {
    if (preview) URL.revokeObjectURL(preview);
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setPreview(null);
    setResult(null);
  }

  const savings = file && result ? Math.round((1 - result.blob.size / file.size) * 100) : 0;

  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
          Image Compressor
        </h1>
        <p className="text-gray-500 text-sm">
          Compress and resize images in the browser. Nothing is uploaded to a server.
        </p>
      </motion.div>

      {/* Drop zone */}
      {!file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-4 p-16 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
            dragOver
              ? 'border-accent-400 bg-accent-50/50'
              : 'border-surface-300 bg-white hover:border-accent-300 hover:bg-surface-50'
          }`}
        >
          <Upload size={32} className="text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Drop an image here or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP supported</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </motion.div>
      )}

      {/* Controls + preview */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-surface-200 rounded-xl p-4 shadow-sm">
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-accent-500"
                />
              </div>
              <div className="bg-white border border-surface-200 rounded-xl p-4 shadow-sm">
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Max Width (px)
                </label>
                <input
                  type="number"
                  placeholder="Original"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-accent-400"
                />
              </div>
              <div className="bg-white border border-surface-200 rounded-xl p-4 shadow-sm">
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-accent-400"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={handleCompress}
                disabled={processing}
                className="flex items-center gap-2 px-5 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                <ImageIcon size={16} />
                {processing ? 'Compressing...' : 'Compress'}
              </button>
              {result && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-surface-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-surface-50 transition-colors shadow-sm"
                >
                  <Download size={16} />
                  Download
                </button>
              )}
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-surface-200 text-gray-500 text-sm font-medium rounded-xl hover:text-red-500 transition-colors shadow-sm ml-auto"
              >
                <Trash2 size={16} />
                Clear
              </button>
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-surface-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">Original</span>
                  <span className="text-xs text-gray-400">{formatBytes(file.size)}</span>
                </div>
                <img
                  src={preview}
                  alt="Original"
                  className="w-full rounded-lg object-contain max-h-64 bg-surface-50"
                />
              </div>

              {result ? (
                <div className="bg-white border border-surface-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500">Compressed</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {formatBytes(result.blob.size)}
                      </span>
                      {savings > 0 && (
                        <span className="text-xs font-medium text-green-600">
                          -{savings}%
                        </span>
                      )}
                    </div>
                  </div>
                  <img
                    src={result.url}
                    alt="Compressed"
                    className="w-full rounded-lg object-contain max-h-64 bg-surface-50"
                  />
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    {result.width} x {result.height}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-white border border-surface-200 rounded-xl p-4 shadow-sm text-gray-300">
                  <ArrowRight size={24} className="mb-2" />
                  <span className="text-xs">Compressed result</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
