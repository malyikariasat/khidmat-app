'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Exact 6 Categories matching Registration Form Options
const CATEGORIES = [
  {
    id: 'plumber',
    name: 'Plumber',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    desc: 'Pipe leakages, bathroom fittings, water tank cleaning & geyser repair.',
  },
  {
    id: 'electrician',
    name: 'Electrician',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    desc: 'Short circuits, breaker fixes, UPS/Solar wiring, and light fittings.',
  },
  {
    id: 'ac-repair',
    name: 'AC / HVAC Technician',
    icon: '❄️',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop',
    desc: 'Gas refilling, master servicing, compressor replacement & inverter fixes.',
  },
  {
    id: 'painter',
    name: 'Home Painter',
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop',
    desc: 'Interior/Exterior painting, damp wall repair, and polish work.',
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    icon: '🪚',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop',
    desc: 'Door lock fixes, furniture repair, custom cabinets & wardrobe setup.',
  },
  {
    id: 'tutor',
    name: 'Home Tutor',
    icon: '📚',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    desc: 'Matric, FSc, O/A Levels home tutors for Math, Science & English.',
  },
];

export default function HomePage() {
  const [dbProviders, setDbProviders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // AI Matcher States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);

  // Dynamic Animated Typing Effect
  const [typedText, setTypedText] = useState('');
  const words = ['Plumber?', 'Electrician?', 'AC Expert?', 'Home Painter?', 'Carpenter?', 'Home Tutor?'];

  useEffect(() => {
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const interval = setInterval(() => {
      const currentWord = words[wordIdx];
      if (isDeleting) {
        setTypedText(currentWord.substring(0, charIdx - 1));
        charIdx--;
      } else {
        setTypedText(currentWord.substring(0, charIdx + 1));
        charIdx++;
      }

      if (!isDeleting && charIdx === currentWord.length) {
        setTimeout(() => { isDeleting = true; }, 1500);
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Fetch Providers Realtime from Firebase
  useEffect(() => {
    async function loadProviders() {
      try {
        const querySnapshot = await getDocs(collection(db, 'providers'));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDbProviders(list);
      } catch (err) {
        console.error("Firebase fetch error:", err);
      }
    }
    loadProviders();
  }, []);

  // AI Search Matcher Logic
  const handleAiSearch = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    
    setTimeout(() => {
      const q = aiPrompt.toLowerCase();
      
      const matched = dbProviders.filter(p => {
        const nameMatch = p.fullName?.toLowerCase().includes(q) || p.businessName?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const descMatch = p.bio?.toLowerCase().includes(q) || p.subServices?.toLowerCase().includes(q);
        const areaMatch = p.sectorArea?.toLowerCase().includes(q);
        
        return nameMatch || catMatch || descMatch || areaMatch;
      });

      setAiResults(matched.length > 0 ? matched : dbProviders.slice(0, 3));
      setAiLoading(false);
    }, 700);
  };

  // Filter providers for Category Click View
  const categoryProviders = selectedCategory 
    ? dbProviders.filter(p => p.category?.toLowerCase() === selectedCategory.id.toLowerCase())
    : [];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      
      {/* 1. Hero Section + Animated Typing Text + Real AI Matcher */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-16 pb-20 px-5 text-center">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
            🤖 Khidmat AI Matchmaker
          </span>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            Find an Expert <span className="text-emerald-400 border-b-4 border-emerald-500">{typedText}</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Describe your problem naturally in Urdu or English — AI will connect you with verified local experts.
          </p>

          <form onSubmit={handleAiSearch} className="relative max-w-2xl mx-auto mt-8">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Geyser leakage fix in sector G-9 Islamabad..."
              className="w-full pl-6 pr-36 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 shadow-2xl backdrop-blur-md"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/30 active:scale-95 disabled:opacity-50"
            >
              {aiLoading ? 'AI Thinking...' : 'AI Match ⚡'}
            </button>
          </form>

        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 space-y-16">

        {/* 2. AI Recommendation Results */}
        {aiResults && (
          <section className="bg-slate-900/90 border border-emerald-500/30 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-emerald-400 flex items-center gap-2">
                🤖 AI Matched Providers ({aiResults.length})
              </h2>
              <button 
                onClick={() => setAiResults(null)}
                className="text-xs text-slate-400 hover:text-white underline font-semibold"
              >
                Clear Search
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiResults.map((p) => (
                <div key={p.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
                        {p.category}
                      </span>
                      <h3 className="font-bold text-white text-base mt-2">{p.businessName || p.fullName}</h3>
                    </div>
                    <span className="text-xs font-black text-amber-400">★ {p.rating || '5.0'}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{p.bio || p.subServices || 'No description provided.'}</p>
                  <p className="text-xs font-semibold text-slate-300">📍 {p.sectorArea || 'Sector G-9'}, {p.city || 'Islamabad'}</p>

                  <a
                    href={`https://wa.me/${p.phone}?text=Hi! I found your service via Khidmat AI.`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Contact via WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Exact 6 Service Categories Cards */}
        <section className="space-y-8">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Main Directory</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Our Featured Services</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => {
              const count = dbProviders.filter(p => p.category?.toLowerCase() === cat.id.toLowerCase()).length;

              return (
                <div 
                  key={cat.id} 
                  className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {/* Category Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      <span className="absolute top-3 right-3 text-xl bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800">
                        {cat.icon}
                      </span>
                    </div>

                    <div className="p-6 space-y-2">
                      <h3 className="font-bold text-white text-xl group-hover:text-emerald-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  {/* Open Category Modal Button */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className="w-full py-3.5 bg-slate-950 hover:bg-emerald-600 border border-slate-800 hover:border-emerald-600 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-between px-4"
                    >
                      <span>View Experts</span>
                      <span className="bg-emerald-950 group-hover:bg-emerald-700 text-emerald-400 group-hover:text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                        {count} Providers Available
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* 4. Selected Category Overlay Showing Dynamic Providers */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-3xl w-full max-h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCategory.icon}</span>
                <div>
                  <h3 className="text-xl font-black text-white">{selectedCategory.name} Specialists</h3>
                  <p className="text-xs text-slate-400">Directly contact active providers registered on Khidmat</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-base"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Active Providers */}
            <div className="p-6 overflow-y-auto space-y-4">
              {categoryProviders.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <p className="text-slate-400 text-sm font-semibold">No registered providers in this category yet.</p>
                  <p className="text-xs text-emerald-400">
                    When someone signs up as a <strong className="underline">{selectedCategory.name}</strong>, they will be listed here automatically!
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {categoryProviders.map((p) => (
                    <div key={p.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-base">{p.businessName || p.fullName}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">👤 {p.fullName}</p>
                        </div>
                        <span className="text-xs font-black text-amber-400">★ {p.rating || '5.0'}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Rate</span>
                          <strong className="text-emerald-400">PKR {p.hourlyRate || '1000'}/hr</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Experience</span>
                          <strong>{p.experienceYears || '1-3 Years'}</strong>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {p.bio || p.subServices || 'Verified professional service provider.'}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span>📍 {p.sectorArea || 'Sector Area'}, {p.city || 'Islamabad'}</span>
                        <span className="text-emerald-400 font-bold">● Live</span>
                      </div>

                      <a
                        href={`https://wa.me/${p.phone}?text=Hi ${p.fullName}, I found your ${selectedCategory.name} profile on Khidmat.`}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-center w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20"
                      >
                        Contact via WhatsApp
                      </a>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </main>
  );
}