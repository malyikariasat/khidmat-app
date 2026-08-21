'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const EMERGENCY_TABS = [
  { id: 'all', label: 'All Emergency Pros', icon: '🚨' },
  { id: 'plumber', label: 'Plumbers', icon: '🔧' },
  { id: 'electrician', label: 'Electricians', icon: '⚡' },
  { id: 'ac-repair', label: 'AC Repair', icon: '❄️' },
  { id: 'painter', label: 'Painters', icon: '🎨' },
  { id: 'carpenter', label: 'Carpenters', icon: '🪚' },
  { id: 'tutor', label: 'Home Tutors', icon: '📚' },
];

export default function EmergencyPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmergencyProviders() {
      try {
        const querySnapshot = await getDocs(collection(db, 'providers'));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // FIX 1: Sirf unhi providers ko filter karein jinka isEmergency == true hai
        const emergencyOnly = list.filter(p => Boolean(p.isEmergency) === true);
        setProviders(emergencyOnly);
      } catch (err) {
        console.error("Error fetching emergency providers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEmergencyProviders();
  }, []);

  // FIX 2: Flexible Category Matching (e.g. "tutor", "Home Tutor", "Tutor" sab match hongay)
  const filteredProviders = (activeTab === 'all'
    ? providers
    : providers.filter(p => {
        const cat = p.category?.toLowerCase() || '';
        const tab = activeTab.toLowerCase();
        return cat.includes(tab) || tab.includes(cat);
      })
  ).slice(0, 2);

  const getCategoryLabel = (category) => {
    switch (category?.toLowerCase()) {
      case 'tutor':
      case 'home tutor':
        return 'Home Tutor';
      case 'painter':
        return 'Professional Painter';
      case 'carpenter':
        return 'Wood Carpenter';
      default:
        return category || 'Emergency Expert';
    }
  };

  const getPluralLabel = () => {
    if (activeTab === 'tutor') return 'URGENT HOME TUTOR(S)';
    if (activeTab === 'painter') return 'URGENT PAINTER(S)';
    if (activeTab === 'carpenter') return 'URGENT CARPENTER(S)';
    return 'URGENT EXPERT(S)';
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-5 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Title Header */}
        <div className="text-center space-y-3">
          <span className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
            🚨 24/7 Rapid Emergency Response
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Urgent Dispatch Specialists
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Top verified emergency responders available right now in Twin Cities.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {EMERGENCY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 border ${
                activeTab === tab.id
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            SHOWING: <span className="text-rose-400 font-black">{filteredProviders.length} {getPluralLabel()}</span>
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Available Now
          </span>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading emergency profiles...</div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-2">
            <p className="text-slate-400 font-bold text-sm">No Emergency Responders Online</p>
            <p className="text-xs text-slate-500">Try switching tabs or check back in a few minutes.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {filteredProviders.map((p) => (
              <div 
                key={p.id} 
                className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 p-6 rounded-3xl space-y-4 shadow-xl relative overflow-hidden transition-all"
              >
                {/* Header Badge */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-950/80 px-3 py-1 rounded-lg border border-rose-800/50">
                    {p.category || 'General'}
                  </span>
                  <span className="text-xs font-black text-amber-400">★ {p.rating || '5.0'}</span>
                </div>

                {/* Dynamic Title */}
                <div>
                  <h3 className="font-extrabold text-white text-lg">
                    {p.name || p.fullName || p.businessName || getCategoryLabel(p.category)}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    👤 Registered {getCategoryLabel(p.category)}
                  </p>
                </div>

                {/* Details Box */}
                <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">📍 Location:</span>
                    <span className="font-bold text-white">{p.sector || p.sectorArea || 'Twin Cities'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">⚡ Response Time:</span>
                    <span className="font-bold text-emerald-400">Under 20 Mins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">💰 Est. Rate:</span>
                    <span className="font-bold text-emerald-400">PKR {p.price || p.hourlyRate || '1000'}</span>
                  </div>
                </div>

                {/* WhatsApp Call Button */}
                <a
                  href={`https://wa.me/${p.phone}?text=URGENT: I need immediate assistance via Khidmat App.`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  <span>WhatsApp Direct Call</span>
                </a>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}