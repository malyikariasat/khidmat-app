'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function RegisterProviderPage() {
  const [formData, setFormData] = useState({
    // Basic Personal & Business Info
    fullName: '',
    businessName: '',
    cnic: '',
    
    // Contact Credentials
    phone: '',
    altPhone: '',
    email: '',

    // Service Credentials
    category: 'plumber',
    subServices: '',
    experienceYears: '1-3 Years',
    hourlyRate: '',
    
    // Location Credentials
    city: 'Islamabad',
    sectorArea: 'G-9',
    fullAddress: '',

    // Operational Availability & Status
    workingHours: '24/7 Emergency',
    isAvailable: true,
    urgencyStatus: 'Available Today',
    
    // Additional Profile Details
    bio: '',
    rating: '5.0',
    reviewsCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Save full extended credentials into Firestore 'providers' collection
      await addDoc(collection(db, 'providers'), {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Firebase registration error:', err);
      setError('Registration failed! Please check your connection or Firebase config.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-5 flex items-center justify-center font-sans">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 border-b border-slate-800 pb-6">
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
            Extended Provider Onboarding
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
            Register Complete Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Provide your verified business and contact details to get listed on Khidmat Network.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-2xl font-semibold">
            ⚠️ {error}
          </div>
        )}

        {submitted ? (
          <div className="bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 p-8 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              ✓
            </div>
            <h3 className="font-extrabold text-xl text-white">Full Profile Registered!</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Your profile with all verification credentials has been saved to Firebase. You can now manage your live status through the dashboard.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/30"
            >
              Register Another Provider
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Personal Identification */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                1. Personal & Verification Info
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Business / Service Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Rawal Expert Services"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  CNIC Number (Verification Purpose) *
                </label>
                <input
                  type="text"
                  name="cnic"
                  required
                  value={formData.cnic}
                  onChange={handleChange}
                  placeholder="37405-1234567-1"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                />
              </div>
            </div>

            {/* Section 2: Contact Credentials */}
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                2. Contact Credentials
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Primary WhatsApp *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03001234567"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Alt / Emergency Phone
                  </label>
                  <input
                    type="text"
                    name="altPhone"
                    value={formData.altPhone}
                    onChange={handleChange}
                    placeholder="03125554321"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="provider@gmail.com"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Professional & Pricing Details */}
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                3. Professional Skills & Pricing
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Main Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white"
                  >
                    <option value="plumber">🔧 Plumber</option>
                    <option value="electrician">⚡ Electrician</option>
                    <option value="ac-repair">❄️ AC / HVAC Technician</option>
                    <option value="painter">🎨 Home Painter</option>
                    <option value="carpenter">🪚 Carpenter</option>
                    <option value="tutor">📚 Home Tutor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Experience Level *
                  </label>
                  <select
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white"
                  >
                    <option value="Less than 1 Year">Less than 1 Year</option>
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years (Expert)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Standard Hourly Rate (PKR) *
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    required
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    placeholder="e.g. 1000"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Specific Sub-Services / Specialties
                </label>
                <input
                  type="text"
                  name="subServices"
                  value={formData.subServices}
                  onChange={handleChange}
                  placeholder="e.g. Leak Detection, Geyser Fitting, Underground Pipe Repairing"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                />
              </div>
            </div>

            {/* Section 4: Location Credentials */}
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                4. Location & Operational Coverage
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white"
                  >
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Primary Sector / Area *
                  </label>
                  <input
                    type="text"
                    name="sectorArea"
                    required
                    value={formData.sectorArea}
                    onChange={handleChange}
                    placeholder="e.g. G-9, F-10, Satellite Town"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Working Shifts / Hours
                  </label>
                  <select
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white"
                  >
                    <option value="24/7 Emergency">24/7 Emergency</option>
                    <option value="Day Shift (8 AM - 8 PM)">Day Shift (8 AM - 8 PM)</option>
                    <option value="Night Shift Only">Night Shift Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Full Workshop / Office Address
                </label>
                <input
                  type="text"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  placeholder="Shop # 12, Main Market, Sector G-9/1, Islamabad"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Short Business Profile / Bio
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Explain why clients should hire you..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-emerald-600/30 active:scale-[0.99] disabled:opacity-50 mt-4"
            >
              {loading ? 'Saving Complete Profile to Firebase...' : 'Submit Credentials & Complete Registration'}
            </button>

          </form>
        )}

      </div>
    </main>
  );
}