import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, Printer, FileText, Eye, Edit3 } from 'lucide-react';
import SEO from '../components/SEO';

const emptyItem = { description: '', quantity: 1, rate: 0 };

const defaultInvoice = {
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companyLogo: '',
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  items: [{ ...emptyItem }],
  taxRate: 0,
  notes: '',
  terms: 'Payment is due within 30 days of the invoice date.',
  currency: 'USD',
};

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'CAD', symbol: 'CA$' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AED', symbol: 'د.إ' },
  { code: 'SAR', symbol: '﷼' },
];

function formatCurrency(amount, currency) {
  const cur = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
  return `${cur.symbol}${amount.toFixed(2)}`;
}

export default function InvoiceGenerator() {
  const [inv, setInv] = useState(defaultInvoice);
  const [view, setView] = useState('edit');
  const previewRef = useRef(null);

  const update = (field, value) => setInv((p) => ({ ...p, [field]: value }));

  const updateItem = (idx, field, value) => {
    setInv((p) => ({
      ...p,
      items: p.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    }));
  };

  const addItem = () => setInv((p) => ({ ...p, items: [...p.items, { ...emptyItem }] }));

  const removeItem = (idx) => {
    if (inv.items.length <= 1) return;
    setInv((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
  };

  const subtotal = inv.items.reduce((s, it) => s + it.quantity * it.rate, 0);
  const tax = subtotal * (inv.taxRate / 100);
  const total = subtotal + tax;

  const handleExportPdf = useCallback(async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const el = previewRef.current;
    if (!el) return;
    html2pdf()
      .set({
        margin: 0.4,
        filename: `${inv.invoiceNumber || 'invoice'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(el)
      .save();
  }, [inv.invoiceNumber]);

  const handleExportWord = useCallback(() => {
    const html = previewRef.current?.innerHTML;
    if (!html) return;
    const content = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"><style>
        body { font-family: Arial, sans-serif; color: #1f2937; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 8px 12px; text-align: left; }
        th { background: #f3f4f6; border-bottom: 2px solid #e5e7eb; font-size: 12px; text-transform: uppercase; color: #6b7280; }
        td { border-bottom: 1px solid #f3f4f6; }
      </style></head>
      <body>${html}</body></html>`;
    const blob = new Blob([content], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${inv.invoiceNumber || 'invoice'}.doc`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [inv.invoiceNumber]);

  const handlePrint = useCallback(() => {
    const el = previewRef.current;
    if (!el) return;
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; padding: 40px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 10px 14px; text-align: left; }
        th { background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-size: 11px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; }
        td { border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        .text-right { text-align: right; }
        @media print { body { padding: 20px; } }
      </style></head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 300);
  }, []);

  const inputCls = 'w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-accent-400 shadow-sm placeholder-gray-300';
  const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

  return (
    <div className="max-w-6xl">
      <SEO
        title="Invoice Generator"
        description="Create professional invoices online for free. Add line items, taxes, and export to PDF, Word, or print directly. No sign-up required."
        path="/invoice-generator"
      />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Invoice Generator</h1>
        <p className="text-gray-500 text-sm">Create professional invoices and export as PDF, Word, or print.</p>
      </motion.div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex bg-surface-100 border border-surface-200 rounded-xl p-1">
          {[
            { id: 'edit', label: 'Edit', icon: Edit3 },
            { id: 'preview', label: 'Preview', icon: Eye },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${view === t.id ? 'text-accent-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {view === t.id && (
                <motion.div layoutId="inv-view" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <t.icon size={14} className="relative z-10" />
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportPdf} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-accent-500 hover:bg-accent-600 rounded-lg transition-colors">
            <Download size={14} /> PDF
          </button>
          <button onClick={handleExportWord} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 bg-white border border-surface-200 rounded-lg shadow-sm transition-colors">
            <FileText size={14} /> Word
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 bg-white border border-surface-200 rounded-lg shadow-sm transition-colors">
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Edit form */}
      {view === 'edit' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Company + Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Business</h3>
              <div><label className={labelCls}>Company Name</label><input type="text" value={inv.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Acme Inc." className={inputCls} /></div>
              <div><label className={labelCls}>Address</label><textarea value={inv.companyAddress} onChange={(e) => update('companyAddress', e.target.value)} placeholder="123 Main St, City, State 12345" rows={2} className={inputCls + ' resize-none'} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Phone</label><input type="text" value={inv.companyPhone} onChange={(e) => update('companyPhone', e.target.value)} placeholder="+1 555-0100" className={inputCls} /></div>
                <div><label className={labelCls}>Email</label><input type="email" value={inv.companyEmail} onChange={(e) => update('companyEmail', e.target.value)} placeholder="billing@acme.com" className={inputCls} /></div>
              </div>
            </div>

            <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bill To</h3>
              <div><label className={labelCls}>Client Name</label><input type="text" value={inv.clientName} onChange={(e) => update('clientName', e.target.value)} placeholder="Client Corp." className={inputCls} /></div>
              <div><label className={labelCls}>Address</label><textarea value={inv.clientAddress} onChange={(e) => update('clientAddress', e.target.value)} placeholder="456 Oak Ave, City, State 67890" rows={2} className={inputCls + ' resize-none'} /></div>
              <div><label className={labelCls}>Email</label><input type="email" value={inv.clientEmail} onChange={(e) => update('clientEmail', e.target.value)} placeholder="accounts@client.com" className={inputCls} /></div>
            </div>
          </div>

          {/* Invoice details */}
          <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><label className={labelCls}>Invoice #</label><input type="text" value={inv.invoiceNumber} onChange={(e) => update('invoiceNumber', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Date</label><input type="date" value={inv.invoiceDate} onChange={(e) => update('invoiceDate', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Due Date</label><input type="date" value={inv.dueDate} onChange={(e) => update('dueDate', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Currency</label>
                <select value={inv.currency} onChange={(e) => update('currency', e.target.value)} className={inputCls}>
                  {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white border border-surface-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Line Items</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 text-xs font-medium text-gray-400">
                <span>Description</span><span>Qty</span><span>Rate</span><span>Amount</span><span />
              </div>
              {inv.items.map((it, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 items-center">
                  <input type="text" value={it.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Service or product..." className={inputCls} />
                  <input type="number" min={0} value={it.quantity} onChange={(e) => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)} className={inputCls + ' text-center'} />
                  <input type="number" min={0} step={0.01} value={it.rate} onChange={(e) => updateItem(i, 'rate', parseFloat(e.target.value) || 0)} className={inputCls + ' text-center'} />
                  <div className="px-3 py-2 text-sm text-gray-700 font-medium">{formatCurrency(it.quantity * it.rate, inv.currency)}</div>
                  <button onClick={() => removeItem(i)} disabled={inv.items.length <= 1} className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="flex items-center gap-1.5 mt-4 px-3 py-1.5 text-xs font-medium text-accent-600 hover:text-accent-700 border border-dashed border-accent-300 rounded-lg hover:bg-accent-50 transition-colors">
              <Plus size={14} /> Add Item
            </button>

            <div className="mt-5 pt-4 border-t border-surface-200 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-800 font-medium">{formatCurrency(subtotal, inv.currency)}</span></div>
                <div className="flex justify-between text-sm items-center gap-2">
                  <span className="text-gray-500">Tax</span>
                  <div className="flex items-center gap-1">
                    <input type="number" min={0} max={100} step={0.5} value={inv.taxRate} onChange={(e) => update('taxRate', parseFloat(e.target.value) || 0)} className="w-16 px-2 py-1 bg-surface-50 border border-surface-200 rounded text-xs text-gray-700 text-center focus:outline-none" />
                    <span className="text-xs text-gray-400">%</span>
                  </div>
                  <span className="text-gray-800 font-medium">{formatCurrency(tax, inv.currency)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-surface-200"><span className="text-gray-700">Total</span><span className="text-gray-900">{formatCurrency(total, inv.currency)}</span></div>
              </div>
            </div>
          </div>

          {/* Notes / Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelCls}>Notes</label><textarea value={inv.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Thank you for your business!" rows={3} className={inputCls + ' resize-none'} /></div>
            <div><label className={labelCls}>Terms & Conditions</label><textarea value={inv.terms} onChange={(e) => update('terms', e.target.value)} rows={3} className={inputCls + ' resize-none'} /></div>
          </div>
        </motion.div>
      )}

      {/* Preview (always rendered for export, hidden when editing) */}
      <div className={view === 'preview' ? '' : 'sr-only'}>
        <div ref={previewRef} className="bg-white border border-surface-200 rounded-xl shadow-sm p-8 md:p-12 max-w-[800px] mx-auto" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#1f2937' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#111827' }}>{inv.companyName || 'Your Company'}</h2>
              {inv.companyAddress && <p style={{ fontSize: 13, color: '#6b7280', margin: '6px 0 0', whiteSpace: 'pre-line' }}>{inv.companyAddress}</p>}
              {inv.companyPhone && <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>{inv.companyPhone}</p>}
              {inv.companyEmail && <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>{inv.companyEmail}</p>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: '#6366f1', margin: 0 }}>INVOICE</h1>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}><strong>{inv.invoiceNumber}</strong></p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Date: {inv.invoiceDate}</p>
              {inv.dueDate && <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>Due: {inv.dueDate}</p>}
            </div>
          </div>

          {/* Bill To */}
          <div style={{ marginBottom: 32, padding: '16px 20px', background: '#f9fafb', borderRadius: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', margin: '0 0 8px' }}>Bill To</p>
            <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#111827' }}>{inv.clientName || 'Client Name'}</p>
            {inv.clientAddress && <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0', whiteSpace: 'pre-line' }}>{inv.clientAddress}</p>}
            {inv.clientEmail && <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>{inv.clientEmail}</p>}
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr>
                <th style={{ padding: '10px 14px', textAlign: 'left', background: '#f9fafb', borderBottom: '2px solid #e5e7eb', fontSize: 11, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Description</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', background: '#f9fafb', borderBottom: '2px solid #e5e7eb', fontSize: 11, textTransform: 'uppercase', color: '#6b7280', width: 70 }}>Qty</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', background: '#f9fafb', borderBottom: '2px solid #e5e7eb', fontSize: 11, textTransform: 'uppercase', color: '#6b7280', width: 100 }}>Rate</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', background: '#f9fafb', borderBottom: '2px solid #e5e7eb', fontSize: 11, textTransform: 'uppercase', color: '#6b7280', width: 110 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {inv.items.map((it, i) => (
                <tr key={i}>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f3f4f6', fontSize: 14 }}>{it.description || '—'}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f3f4f6', fontSize: 14, textAlign: 'center' }}>{it.quantity}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f3f4f6', fontSize: 14, textAlign: 'right' }}>{formatCurrency(it.rate, inv.currency)}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f3f4f6', fontSize: 14, textAlign: 'right', fontWeight: 500 }}>{formatCurrency(it.quantity * it.rate, inv.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
            <div style={{ width: 240 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}><span style={{ color: '#6b7280' }}>Subtotal</span><span>{formatCurrency(subtotal, inv.currency)}</span></div>
              {inv.taxRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}><span style={{ color: '#6b7280' }}>Tax ({inv.taxRate}%)</span><span>{formatCurrency(tax, inv.currency)}</span></div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', borderTop: '2px solid #e5e7eb', fontSize: 18, fontWeight: 700 }}><span>Total</span><span style={{ color: '#6366f1' }}>{formatCurrency(total, inv.currency)}</span></div>
            </div>
          </div>

          {/* Notes / Terms */}
          {(inv.notes || inv.terms) && (
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {inv.notes && (
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', margin: '0 0 6px' }}>Notes</p>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, whiteSpace: 'pre-line' }}>{inv.notes}</p>
                </div>
              )}
              {inv.terms && (
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', margin: '0 0 6px' }}>Terms & Conditions</p>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, whiteSpace: 'pre-line' }}>{inv.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
