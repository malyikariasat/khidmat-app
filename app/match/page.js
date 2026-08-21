'use client';

import { useState, useEffect } from 'react';
import ProviderCard from '@/components/ProviderCard';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { PROVIDERS } from '@/data/providers'; // Fallback dummy data import

export default function MatchPage() {
  const [category, setCategory] = useState('plumber');
  const [sector, setSector] = useState('G-9, Islamabad');
  const [urgency, setUrgency] = useState('Urgent — right now');
  const [budgetMin, setBudgetMin] = useState('1000');
  const [budgetMax, setBudgetMax] = useState('4000');
  const [notes, setNotes] = useState('');

  const [allProviders, setAllProviders] = useState(PROVIDERS || []); // Initialized with fallback
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Load providers from Firebase and merge with local data
  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDocs(collection(db, 'providers'));
        const firebaseList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (firebaseList.length > 0) {
          setAllProviders([...firebaseList, ...PROVIDERS]);
        }
      } catch (err) {
        console.error('Firebase load error, using local fallback:', err);
      }
    }
    loadData();
  }, []);

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          sector,
          urgency,
          budgetMin,
          budgetMax,
          notes,
          providers: allProviders,
        }),
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
    <div className="max-w-2xl mx-auto px-5 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">AI Service Matcher</h1>

      <form onSubmit={handleMatchSubmit} className="space-y-4 bg-white p-6 border border-line rounded-2xl shadow-sm">
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-ink/70 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-xl text-sm focus:outline-none focus:border-signal"
          >
            <option value="plumber">🔧 Plumber</option>
            <option value="electrician">⚡ Electrician</option>
            <option value="tutor">📚 Tutor</option>
            <option value="painter">🎨 Painter</option>
          </select>
        </div>

        {/* Area / Sector */}
        <div>
          <label className="block text-xs font-semibold text-ink/70 mb-1">Area / Sector</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-xl text-sm focus:outline-none focus:border-signal"
          >
            <option value="G-6, Islamabad">G-6, Islamabad</option>
            <option value="G-9, Islamabad">G-9, Islamabad</option>
            <option value="F-10, Islamabad">F-10, Islamabad</option>
            <option value="Chaklala, Rawalpindi">Chaklala, Rawalpindi</option>
            <option value="Satellite Town, Rawalpindi">Satellite Town, Rawalpindi</option>
          </select>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-xs font-semibold text-ink/70 mb-1">Urgency</label>
          <div className="flex gap-2">
            {['Urgent — right now', 'Today', 'Flexible / this week'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setUrgency(option)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                  urgency === option
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'border-line text-ink/70 hover:bg-slate-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Min & Max */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink/70 mb-1">Budget min (Rs)</label>
            <input
              type="number"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-xl text-sm focus:outline-none focus:border-signal"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink/70 mb-1">Budget max (Rs)</label>
            <input
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className="w-full px-3 py-2 border border-line rounded-xl text-sm focus:outline-none focus:border-signal"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-ink/70 mb-1">Notes (optional)</label>
          <input
            type="text"
            value={notes}
            placeholder="e.g. leaking tap under kitchen sink"
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-line rounded-xl text-sm focus:outline-none focus:border-signal"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm rounded-xl transition disabled:opacity-50 mt-2"
        >
          {loading ? 'AI Finding Best Matches...' : 'Find my top 3 matches'}
        </button>
      </form>

      {/* Results Section */}
      {searched && (
        <div className="mt-8 space-y-4">
          <h2 className="font-bold text-lg text-ink">
            {loading ? '🤖 AI is analyzing providers...' : `Top Matches Found (${results.length})`}
          </h2>

          {!loading && results.length === 0 && (
            <p className="text-xs text-ink/60 bg-slate-100 p-4 rounded-xl">
              No direct provider matched your criteria. Try adjusting your budget or sector.
            </p>
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