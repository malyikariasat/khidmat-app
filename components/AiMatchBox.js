'use client';

import { useState } from 'react';
import ProviderCard from './ProviderCard';

export default function AiMatchBox({ allProviders = [] }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, providers: allProviders }),
      });

      const data = await res.json();
      setResults(data.result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-6 shadow-md mb-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">✨</span>
        <h2 className="font-display font-bold text-xl">AI Assistant Recommendation</h2>
      </div>
      <p className="text-xs text-emerald-100/80 mb-4">
        Apna masla likhein (e.g. "Geyser pipe leaking in F-10" ya "AC not cooling in Satellite Town")
      </p>

      <form onSubmit={handleAiSearch} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. I need urgent electrician for short circuit in G-11..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Find Match'}
        </button>
      </form>

      {/* Results Section */}
      {searched && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-sm font-bold mb-3 text-emerald-300">
            {loading ? '🔍 Analyzing providers...' : `Found ${results.length} Best AI Match(es):`}
          </h3>

          {!loading && results.length === 0 && (
            <p className="text-xs text-white/70">No direct provider match found for this prompt. Try different keywords.</p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {results.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}