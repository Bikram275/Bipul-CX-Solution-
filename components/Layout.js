
import React, { useState, useEffect } from 'react';
import htm from 'htm';
import * as Lucide from 'lucide-react';
import { CATEGORIES } from '../types.js';

const html = htm.bind(React.createElement);

const CATEGORY_COLORS = {
  'Ordered': 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  'Shipped': 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
  'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  'Return': 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
  'Exchange': 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  'Cancelled': 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  'Refund': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100',
  'Non Order': 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
};

export default function Layout({ children, currentView, setView, isAdmin, toggleRole, sops, onSelectSop }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState('All');

  // Handle Google Translate Initialization & Global Key Listeners
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,bn,hi',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };
    
    // If script is already loaded, manually trigger
    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    // Escape Key Listener to close slider
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSops = sops
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(menuSearch.toLowerCase());
        const matchesCategory = menuFilter === 'All' || s.category === menuFilter;
        return matchesSearch && matchesCategory;
    });

  const handleResetFilters = () => {
    setMenuSearch('');
    setMenuFilter('All');
  };

  return html`
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 z-40 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
            <button onClick=${() => { setView('AGENT_HOME'); setIsMenuOpen(false); }} className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                   <${Lucide.Activity} size=${20} />
                </div>
                <span className="font-black text-xl tracking-tighter brand-gradient">Cx Solution By Bipul</span>
            </button>
            
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            
            <button onClick=${toggleRole} className=${`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-bold text-sm ${isAdmin ? 'bg-rose-50 text-rose-600 border-rose-100' : 'text-slate-600 border-transparent hover:bg-slate-100'}`}>
                <${Lucide.ShieldCheck} size=${18} /> <span className="hidden lg:inline">${isAdmin ? 'Exit Admin' : 'Admin Panel'}</span>
            </button>
        </div>

        <div className="flex items-center gap-4">
            <!-- Google Translate Widget Container -->
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-2xl border-2 border-indigo-100 hover:border-indigo-200 transition-all">
               <${Lucide.Languages} size=${16} className="text-indigo-600" />
               <div id="google_translate_element"></div>
            </div>

            <button onClick=${() => setIsMenuOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 font-bold text-sm">
                <${Lucide.Menu} size=${18} /> <span>All Disposition</span>
            </button>
        </div>
      </header>

      <!-- Sidebar Slider - Wide size -->
      <div className=${`fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-out z-50 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-rose-500"></div>
            <div>
              <h2 className="font-black text-2xl tracking-tight">Disposition Explorer</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Cx Solution By Bipul</p>
            </div>
            <button onClick=${() => setIsMenuOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all hover:rotate-90">
                <${Lucide.X} size=${28} />
            </button>
        </div>
        <div className="p-8 bg-slate-50 border-b space-y-6">
            <div className="relative">
                <input type="text" placeholder="Search by name..." className="w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-lg shadow-sm" value=${menuSearch} onChange=${(e) => setMenuSearch(e.target.value)} />
                <${Lucide.Search} className="absolute left-4 top-4.5 text-slate-400" size=${24} />
                
                <!-- Refresh/Clear Search Button -->
                ${menuSearch && html`
                  <button 
                    onClick=${() => setMenuSearch('')} 
                    className="absolute right-4 top-4.5 text-slate-300 hover:text-indigo-600 transition-colors"
                    title="Clear search"
                  >
                    <${Lucide.RotateCw} size=${22} className="animate-in fade-in zoom-in duration-200" />
                  </button>
                `}
            </div>
            
            <!-- Category Dropdown -->
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Filter by Category</label>
                ${(menuFilter !== 'All' || menuSearch !== '') && html`
                  <button onClick=${handleResetFilters} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Reset All</button>
                `}
              </div>
              <div className="relative">
                <select 
                  className="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all font-black text-xs uppercase tracking-widest appearance-none cursor-pointer" 
                  value=${menuFilter} 
                  onChange=${(e) => setMenuFilter(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    ${CATEGORIES.map(cat => html`<option key=${cat} value=${cat}>${cat}</option>`)}
                </select>
                <${Lucide.ChevronDown} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size=${20} />
              </div>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
            ${filteredSops.map((sop, i) => html`
                <button 
                    key=${sop.id} 
                    onClick=${() => { onSelectSop(sop); setIsMenuOpen(false); }} 
                    className=${`w-full text-left p-5 rounded-[1.5rem] border-2 transition-all flex justify-between items-center group relative overflow-hidden ${CATEGORY_COLORS[sop.category] || 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'}`}
                >
                    <div className="flex flex-col relative z-10">
                      <span className="font-black text-base leading-tight break-all uppercase tracking-tight">${sop.title}</span>
                      <span className="text-[10px] opacity-60 font-mono mt-1 tracking-widest">${sop.id}</span>
                    </div>
                    <${Lucide.ChevronRight} size=${20} className="relative z-10 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-10"></div>
                </button>
            `)}
            ${filteredSops.length === 0 && html`<div className="p-20 text-center text-slate-400 font-bold italic">No matching results.</div>`}
        </div>
      </div>

      ${isMenuOpen && html`<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick=${() => setIsMenuOpen(false)} />`}
      <main className="pt-24 px-6 max-w-[1600px] mx-auto">${children}</main>
    </div>`;
}
