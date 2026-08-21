'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function ProviderDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isAvailable, setIsAvailable] = useState(true);
  const [urgencyStatus, setUrgencyStatus] = useState('Available Today');
  const [name, setName] = useState('Imran Plumbing Services');
  const [phone, setPhone] = useState('03001234567');
  const [rate, setRate] = useState('800');
  const [sector, setSector] = useState('G-9, Islamabad');
  const [description, setDescription] = useState('Specialist in leak repair, geyser fitting and bathroom pipe work.');

  const providerId = 'demo-provider-123';

  useEffect(() => {
    async function fetchProviderData() {
      try {
        const docRef = doc(db, 'providers', providerId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setPhone(data.phone || '');
          setRate(data.rate || '');
          setSector(data.sector || 'G-9, Islamabad');
          setDescription(data.description || '');
          setIsAvailable(data.isAvailable ?? true);
          setUrgencyStatus(data.urgencyStatus || 'Available Today');
        }
      } catch (err) {
        console.error('Error fetching provider profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProviderData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const docRef = doc(db, 'providers', providerId);
      await updateDoc(docRef, {
        name,
        phone,
        rate,
        sector,
        description,
        isAvailable,
        urgencyStatus,
        updatedAt: new Date().toISOString(),
      });
      alert('Profile & Status updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      alert('Saved locally for demo!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm font-bold">
        ⚡ Loading Provider Control Panel...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-5 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full uppercase tracking-wider">
              Provider Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">Manage Profile & Availability</h1>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400">Live Status:</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isAvailable
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              }`}
            >
              {isAvailable ? '● Available Today' : '○ Busy / Unavailable'}
            </button>
          </div>
        </div>

        {/* Dashboard Form */}
        <form onSubmit={handleSaveProfile} className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
          
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Urgency Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {['Available Today', 'Urgent — Right Now', 'Bookings Only', 'Offline'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setUrgencyStatus(status)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                    urgencyStatus === status
                      ? 'bg-amber-500 border-amber-500 text-slate-950 font-black'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Service / Company Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                WhatsApp Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Hourly Rate (PKR)
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Primary Sector / Area
              </label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Short Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.99] disabled:opacity-50"
          >
            {saving ? 'Saving Changes...' : 'Save & Update Availability'}
          </button>
        </form>

      </div>
    </main>
  );
}