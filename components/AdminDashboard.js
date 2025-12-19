
import React, { useState, useRef } from 'react';
import htm from 'htm';
import * as Lucide from 'lucide-react';
import { exportSOPs } from '../services/storageService.js';
import { CATEGORIES } from '../types.js';

const html = htm.bind(React.createElement);

const CATEGORY_ROW_STYLE = {
  'Ordered': 'border-l-blue-500',
  'Shipped': 'border-l-sky-500',
  'Delivered': 'border-l-emerald-500',
  'Return': 'border-l-orange-500',
  'Exchange': 'border-l-indigo-500',
  'Cancelled': 'border-l-rose-500',
  'Refund': 'border-l-fuchsia-500',
  'Non Order': 'border-l-slate-400'
};

const CATEGORY_TAG_COLOR = {
  'Ordered': 'bg-blue-100 text-blue-700',
  'Shipped': 'bg-sky-100 text-sky-700',
  'Delivered': 'bg-emerald-100 text-emerald-700',
  'Return': 'bg-orange-100 text-orange-700',
  'Exchange': 'bg-indigo-100 text-indigo-700',
  'Cancelled': 'bg-rose-100 text-rose-700',
  'Refund': 'bg-fuchsia-100 text-fuchsia-700',
  'Non Order': 'bg-slate-100 text-slate-700'
};

export default function AdminDashboard({ sops, onCreateSOP, onEditSOP, onDeleteSOP, onImportData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('All');
  const fileInputRef = useRef(null);

  const filteredSops = sops
    .filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = adminCategoryFilter === 'All' || s.category === adminCategoryFilter;
        return matchesSearch && matchesCategory;
    })
    .sort((a, b) => (b.views || 0) - (a.views || 0));

  const handleExport = async () => {
    const data = await exportSOPs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP_Genius_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onImportData(event.target.result);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return html`
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-200 pb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admin Console</h2>
          <p className="text-slate-500 font-bold text-lg mt-1">Global management of ${sops.length} entries</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <input type="file" ref=${fileInputRef} onChange=${handleFileChange} className="hidden" accept=".json" />
          <button onClick=${handleImportClick} className="bg-white border-2 border-gray-200 px-6 py-3 rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all font-black text-sm shadow-sm flex items-center gap-2">
            <${Lucide.Upload} size=${18} /> Import
          </button>
          <button onClick=${handleExport} className="bg-white border-2 border-gray-200 px-6 py-3 rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all font-black text-sm shadow-sm flex items-center gap-2">
            <${Lucide.Download} size=${18} /> Export
          </button>
          <button onClick=${onCreateSOP} className="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all font-black text-sm shadow-xl shadow-blue-200 flex items-center gap-2">
            <${Lucide.Plus} size=${18} /> New Disposition
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl overflow-hidden flex flex-col h-[750px]">
          <div className="p-8 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
            <h3 className="font-black text-slate-800 text-xl uppercase tracking-tighter">Database Management</h3>
            <div className="flex gap-3">
                <div className="relative w-72">
                   <input type="text" placeholder="Search entries..." className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none text-sm transition-all" value=${searchTerm} onChange=${(e) => setSearchTerm(e.target.value)} />
                   <${Lucide.Search} className="absolute left-4 top-3.5 text-gray-400" size=${18} />
                </div>
                <select className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm outline-none focus:border-blue-500 font-bold" value=${adminCategoryFilter} onChange=${(e) => setAdminCategoryFilter(e.target.value)}>
                    <option value="All">All Categories</option>
                    ${CATEGORIES.map(cat => html`<option key=${cat} value=${cat}>${cat}</option>`)}
                </select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-[10px] uppercase text-slate-400 font-black tracking-[0.2em] sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="px-8 py-5">Title / ID</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5 text-center">Visits</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                ${filteredSops.map(sop => html`
                  <tr key=${sop.id} className=${`hover:bg-blue-50/10 transition-colors border-l-4 ${CATEGORY_ROW_STYLE[sop.category] || 'border-l-transparent'}`}>
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-800 text-base break-all">${sop.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest">${sop.id}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className=${`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${CATEGORY_TAG_COLOR[sop.category] || 'bg-gray-100 text-gray-600'}`}>
                        ${sop.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="text-slate-700 font-black text-lg">${sop.views || 0}</div>
                    </td>
                    <td className="px-8 py-6 text-right space-x-3">
                      <button onClick=${() => onEditSOP(sop)} className="p-3 text-blue-600 hover:bg-blue-100 rounded-2xl" title="Edit">
                        <${Lucide.Edit2} size=${18} />
                      </button>
                      <button onClick=${() => onDeleteSOP(sop.id)} className="p-3 text-red-500 hover:bg-red-100 rounded-2xl" title="Delete">
                        <${Lucide.Trash2} size=${18} />
                      </button>
                    </td>
                  </tr>
                `)}
                ${filteredSops.length === 0 && html`
                   <tr><td colSpan="4" className="text-center py-40 text-slate-400 font-bold">No results found.</td></tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
    </div>`;
}
