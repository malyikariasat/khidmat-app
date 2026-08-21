'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950">
            K
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight block leading-tight">Khidmat<span className="text-emerald-400">.</span></span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold block">TWIN CITIES</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950 p-1 rounded-full border border-slate-800">
          <Link href="/" className="px-4 py-1.5 text-xs font-bold rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all">
            Home
          </Link>
          <Link href="/provider/dashboard" className="px-4 py-1.5 text-xs font-bold rounded-full text-slate-400 hover:text-white transition-all">
            Dashboard
          </Link>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-2">
          <Link 
            href="/provider/register" 
            className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all"
          >
            + Join as Provider
          </Link>

          <Link 
            href="/emergency" 
            className="px-3.5 py-2 text-xs font-black rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            Emergency
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none text-xl"
            aria-label="Toggle Menu"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-4 space-y-2">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-slate-200 hover:bg-slate-900 rounded-lg"
          >
            🏠 Home
          </Link>
          <Link 
            href="/provider/dashboard" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-slate-200 hover:bg-slate-900 rounded-lg"
          >
            📊 Dashboard
          </Link>
          <Link 
            href="/provider/register" 
            onClick={() => setIsOpen(false)}
            className="block sm:hidden px-3 py-2 text-sm font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-lg"
          >
            ➕ Join as Provider
          </Link>
        </div>
      )}
    </nav>
  );
}