'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function ProviderDashboard() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [providerData, setProviderData] = useState(null);
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Verify Provider by Phone
  const handleVerifyPhone = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const q = query(
        collection(db, 'providers'),
        where('phone', '==', phoneNumber.trim())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Yeh phone number kisi provider record se match nahi hua.');
        setLoading(false);
        return;
      }

      querySnapshot.forEach((docSnap) => {
        setDocId(docSnap.id);
        const data = docSnap.data();
        setProviderData({
          ...data,
          isAvailable: data.isAvailable ?? true,
          isEmergency: data.isEmergency ?? false,
          price: data.price || '',
        });
      });
    } catch (err) {
      console.error(err);
      setError('Database connection error.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Update Profile Data
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const docRef = doc(db, 'providers', docId);
      await updateDoc(docRef, {
        name: providerData.name || '',
        category: providerData.category || '',
        sector: providerData.sector || '',
        bio: providerData.bio || '',
        price: providerData.price || '',
        isAvailable: Boolean(providerData.isAvailable),
        isEmergency: Boolean(providerData.isEmergency),
      });
      setSuccess('Profile aur Availability status successfully update ho gaye!');
    } catch (err) {
      console.error(err);
      setError('Profile update nahi ho saki.');
    } finally {
      setLoading(false);
    }
  };

  // Phone Verification View
  if (!providerData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-1">Provider Dashboard Login</h2>
          <p className="text-xs text-slate-400 mb-6">
            Apna status change karne ke liye registered phone number enter karein.
          </p>

          <form onSubmit={handleVerifyPhone} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">Phone Number</label>
              <input
                type="text"
                required
                placeholder="e.g. 03425553478"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all"
            >
              {loading ? 'Checking...' : 'Login to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Edit View
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex justify-center">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold">Manage Profile & Status</h1>
            <p className="text-xs text-slate-400">Phone: {providerData.phone}</p>
          </div>
          <button
            onClick={() => {
              setProviderData(null);
              setPhoneNumber('');
            }}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          
          {/* Availability Status Toggles */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Current Availability</p>
                <p className="text-xs text-slate-400">Kya aap abhi kaam ke liye available hain?</p>
              </div>
              <button
                type="button"
                onClick={() => setProviderData({ ...providerData, isAvailable: !providerData.isAvailable })}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                  providerData.isAvailable
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {providerData.isAvailable ? '🟢 Available' : '🔴 Busy / Offline'}
              </button>
            </div>

            <hr className="border-slate-800" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Emergency Services</p>
                <p className="text-xs text-slate-400">24/7 Emergency calls accept karein ga?</p>
              </div>
              <button
                type="button"
                onClick={() => setProviderData({ ...providerData, isEmergency: !providerData.isEmergency })}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                  providerData.isEmergency
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {providerData.isEmergency ? '🚨 Active' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">Name</label>
            <input
              type="text"
              value={providerData.name || ''}
              onChange={(e) => setProviderData({ ...providerData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">Category</label>
              <input
                type="text"
                value={providerData.category || ''}
                onChange={(e) => setProviderData({ ...providerData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">Sector / Location</label>
              <input
                type="text"
                value={providerData.sector || ''}
                onChange={(e) => setProviderData({ ...providerData, sector: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">Visiting Charges / Rate (PKR)</label>
            <input
              type="text"
              placeholder="e.g. 1000 / visit"
              value={providerData.price || ''}
              onChange={(e) => setProviderData({ ...providerData, price: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">Bio / Details</label>
            <textarea
              rows={3}
              value={providerData.bio || ''}
              onChange={(e) => setProviderData({ ...providerData, bio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}
          {success && <p className="text-xs text-emerald-400 font-semibold">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all"
          >
            {loading ? 'Saving...' : 'Update Profile & Status'}
          </button>
        </form>
      </div>
    </div>
  );
}