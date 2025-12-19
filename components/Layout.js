
import React, { useState } from 'react';
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

  const filteredSops = sops
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(menuSearch.toLowerCase());
        const matchesCategory = menuFilter === 'All' || s.category === menuFilter;
        return matchesSearch && matchesCategory;
    });

  return html`
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-40 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
            <button onClick=${() => { setView('AGENT_HOME'); setIsMenuOpen(false); }} className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-medium">
                <${Lucide.Home} size=${20} /> <span className="hidden sm:inline">Home</span>
            </button>
            <button onClick=${toggleRole} className=${`flex items-center gap-2 px-3 py-2 rounded-lg border ${isAdmin ? 'bg-red-50 text-red-600 border-red-100' : 'text-gray-600'}`}>
                <${Lucide.ShieldCheck} size=${20} /> <span className="hidden sm:inline">${isAdmin ? 'Exit Admin' : 'Admin'}</span>
            </button>
        </div>
        <div className="flex items-center gap-4">
            <div id="google_translate_element"></div>
            <button onClick=${() => setIsMenuOpen(true)} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                <${Lucide.Menu} size=${20} /> <span>All Disposition</span>
            </button>
        </div>
      </header>

      <!-- Sidebar Slider - Wide size -->
      <div className=${`fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <h2 className="font-bold text-xl">All Disposition</h2>
            <button onClick=${() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><${Lucide.X} size=${28} /><//>
        </div>
        <div className="p-6 bg-gray-50 border-b space-y-4">
            <div className="relative">
                <input type="text" placeholder="Search by title..." className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all" value=${menuSearch} onChange=${(e) => setMenuSearch(e.target.value)} />
                <${Lucide.Search} className="absolute left-4 top-3.5 text-gray-400" size=${20} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category Filter</label>
              <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white" value=${menuFilter} onChange=${(e) => setMenuFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  ${CATEGORIES.map(cat => html`<option key=${cat} value=${cat}>${cat}</option>`)}
              </select>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            ${filteredSops.map((sop, i) => html`
                <button 
                    key=${sop.id} 
                    onClick=${() => { onSelectSop(sop); setIsMenuOpen(false); }} 
                    className=${`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center group ${CATEGORY_COLORS[sop.category] || 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50'}`}
                >
                    <div className="flex flex-col">
                      <span className="font-bold text-sm leading-tight break-all">${sop.title}</span>
                      <span className="text-[10px] opacity-60 font-mono mt-1">${sop.id}</span>
                    </div>
                    <${Lucide.ChevronRight} size=${16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            `)}
            ${filteredSops.length === 0 && html`<div className="p-10 text-center text-gray-400">No dispositions found.</div>`}
        </div>
      </div>

      ${isMenuOpen && html`<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick=${() => setIsMenuOpen(false)} />`}
      <main className="pt-20 px-4 max-w-[1600px] mx-auto">${children}</main>
    </div>`;
}
