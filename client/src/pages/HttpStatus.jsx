import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import SEO from '../components/SEO';

const CODES = [
  { code: 100, text: 'Continue', desc: 'Server received the request headers; client should send the body.' },
  { code: 101, text: 'Switching Protocols', desc: 'Server is switching protocols as requested by client.' },
  { code: 200, text: 'OK', desc: 'Request succeeded. Standard response for successful HTTP requests.' },
  { code: 201, text: 'Created', desc: 'Request fulfilled and a new resource was created.' },
  { code: 204, text: 'No Content', desc: 'Request succeeded but no content to return.' },
  { code: 206, text: 'Partial Content', desc: 'Server delivered only part of the resource due to a range header.' },
  { code: 301, text: 'Moved Permanently', desc: 'Resource has been permanently moved to a new URL.' },
  { code: 302, text: 'Found', desc: 'Resource temporarily resides under a different URL.' },
  { code: 304, text: 'Not Modified', desc: 'Resource has not been modified since last requested.' },
  { code: 307, text: 'Temporary Redirect', desc: 'Request should be repeated with another URL, but future requests should still use the original.' },
  { code: 308, text: 'Permanent Redirect', desc: 'Request and all future requests should be repeated using another URL.' },
  { code: 400, text: 'Bad Request', desc: 'Server cannot process the request due to a client error (malformed syntax, invalid parameters).' },
  { code: 401, text: 'Unauthorized', desc: 'Authentication is required and has failed or has not been provided.' },
  { code: 403, text: 'Forbidden', desc: 'Server understood the request but refuses to authorize it.' },
  { code: 404, text: 'Not Found', desc: 'Requested resource could not be found on the server.' },
  { code: 405, text: 'Method Not Allowed', desc: 'Request method is not supported for the requested resource.' },
  { code: 408, text: 'Request Timeout', desc: 'Server timed out waiting for the request.' },
  { code: 409, text: 'Conflict', desc: 'Request could not be completed due to a conflict with the current state of the resource.' },
  { code: 410, text: 'Gone', desc: 'Resource is no longer available and will not be available again.' },
  { code: 413, text: 'Payload Too Large', desc: 'Request entity is larger than the server is willing to process.' },
  { code: 415, text: 'Unsupported Media Type', desc: 'Server does not support the media type of the request body.' },
  { code: 422, text: 'Unprocessable Entity', desc: 'Request was well-formed but has semantic errors.' },
  { code: 429, text: 'Too Many Requests', desc: 'User has sent too many requests in a given amount of time (rate limiting).' },
  { code: 500, text: 'Internal Server Error', desc: 'Generic server error when no more specific message is suitable.' },
  { code: 501, text: 'Not Implemented', desc: 'Server does not recognize the request method or cannot fulfill it.' },
  { code: 502, text: 'Bad Gateway', desc: 'Server received an invalid response from an upstream server.' },
  { code: 503, text: 'Service Unavailable', desc: 'Server is temporarily unable to handle the request (overloaded or under maintenance).' },
  { code: 504, text: 'Gateway Timeout', desc: 'Server did not receive a timely response from an upstream server.' },
];

function codeColor(code) {
  if (code < 200) return 'text-gray-500 bg-gray-50 border-gray-200';
  if (code < 300) return 'text-green-700 bg-green-50 border-green-200';
  if (code < 400) return 'text-blue-700 bg-blue-50 border-blue-200';
  if (code < 500) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

export default function HttpStatus() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CODES.filter((c) =>
      String(c.code).includes(q) ||
      c.text.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="max-w-4xl">
      <SEO title="HTTP Status Code Reference" description="Complete HTTP status code reference with descriptions. Search and find any HTTP response code quickly. Developer cheat sheet." path="/http-status" />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">HTTP Status Codes</h1>
        <p className="text-gray-500 text-sm">Searchable reference for all common HTTP status codes.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by code or text..." className="w-full pl-10 pr-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-400 shadow-sm" />
      </motion.div>

      <div className="space-y-2">
        {filtered.map((c) => (
          <motion.div key={c.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-start gap-4 p-4 rounded-xl border ${codeColor(c.code)}`}>
            <span className="text-lg font-bold font-mono w-12 shrink-0">{c.code}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{c.text}</p>
              <p className="text-xs mt-0.5 opacity-80">{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-center text-gray-400 py-12 text-sm">No matching status codes.</p>}
    </div>
  );
}
