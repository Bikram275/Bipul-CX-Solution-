
import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';
import * as Lucide from 'lucide-react';

const html = htm.bind(React.createElement);

export default function AgentDashboard({ viewMode, selectedSOP, onSelectSOP, sops, onImportData }) {
  const [sessionSteps, setSessionSteps] = useState([]);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const quickAccessSOPs = [...sops]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 8);

  useEffect(() => {
    if (viewMode === 'CHAT' && selectedSOP) initializeSession(selectedSOP);
  }, [selectedSOP, viewMode]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [sessionSteps]);

  const initializeSession = (sop) => {
    if (sop.flowSteps?.length > 0) {
        const startStep = sop.flowSteps.find(s => s.id === 'START') || sop.flowSteps[0];
        setSessionSteps([startStep]);
    } else {
        setSessionSteps([{ id: 'FINAL', message: sop.content || 'No specific content available for this disposition.', isFinal: true, options: [] }]);
    }
  };

  const handleOptionClick = (idx, opt) => {
    const currentHistory = sessionSteps.slice(0, idx + 1);
    const next = selectedSOP.flowSteps.find(s => s.id === opt.nextStepId);
    if (next) setSessionSteps([...currentHistory, next]);
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

  if (viewMode === 'HOME') {
    return html`
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative bg-slate-900 rounded-[3rem] p-12 mb-16 overflow-hidden shadow-2xl shadow-indigo-100">
           <!-- Abstract background shapes -->
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
           <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full mb-6">
                   <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                   <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Official Agent Hub</span>
                </div>
                <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tighter mb-4 leading-none">
                   Cx Solution<br/>
                   <span className="bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent italic">By Bipul</span>
                </h1>
                <p className="text-slate-400 font-bold text-xl max-w-xl leading-relaxed"> Standard Operating Procedures transformed into intelligent agent guidance.</p>
              </div>
              
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <input type="file" ref=${fileInputRef} onChange=${handleFileChange} className="hidden" accept=".json" />
                <button onClick=${handleImportClick} className="flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-5 rounded-[2rem] hover:bg-indigo-50 transition-all font-black text-lg shadow-xl hover:scale-105 active:scale-95 group">
                  <${Lucide.Database} size=${24} className="text-indigo-600 group-hover:rotate-12 transition-transform" /> Load Knowledge Base
                </button>
                <p className="text-slate-500 text-center text-xs font-bold uppercase tracking-widest">Version 4.0 Pro</p>
              </div>
           </div>
        </div>

        <div className="space-y-10">
           <div className="flex items-center gap-4 text-slate-800 font-black text-2xl uppercase tracking-tighter">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                <${Lucide.Star} size=${24} />
              </div>
              Priority Dispositions
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               ${quickAccessSOPs.map(sop => html`
                   <button key=${sop.id} onClick=${() => onSelectSOP(sop)} className="bg-white p-8 rounded-[2.5rem] border-2 border-transparent hover:border-indigo-500 hover:shadow-[0_20px_60px_rgba(99,102,241,0.15)] transition-all text-left shadow-sm group relative overflow-hidden bg-white hover:-translate-y-2">
                       <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <${Lucide.ArrowUpRight} size=${28} className="text-indigo-500" />
                       </div>
                       <div className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3">${sop.category}</div>
                       <div className="font-black text-slate-800 text-xl leading-snug mb-6 break-all tracking-tight uppercase">${sop.title}</div>
                       <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-widest pt-6 border-t border-slate-50">
                          <span className="flex items-center gap-2"><${Lucide.TrendingUp} size=${14} /> ${sop.views || 0} VISITS</span>
                       </div>
                   </button>
               `)}
           </div>
        </div>
      </div>`;
  }

  return html`
    <!-- Full display chat box -->
    <div className="w-full max-w-[1500px] mx-auto bg-white rounded-[4rem] shadow-2xl border border-slate-100 min-h-[calc(100vh-160px)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
       <div className="p-10 border-b border-slate-50 bg-slate-900 flex justify-between items-center relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
            <div className="flex items-center gap-8">
               <div className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                  <${Lucide.MessageSquareText} size=${36} />
               </div>
               <div>
                  <h2 className="font-black text-white leading-tight text-4xl tracking-tighter break-all uppercase">${selectedSOP?.title}</h2>
                  <div className="flex items-center gap-5 mt-3">
                    <span className="px-5 py-2 bg-indigo-500/20 text-indigo-300 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] border border-indigo-500/30">${selectedSOP?.category}</span>
                    <span className="text-sm text-slate-500 font-mono tracking-widest uppercase opacity-70">${selectedSOP?.id}</span>
                  </div>
               </div>
            </div>
            <button onClick=${() => initializeSession(selectedSOP)} className="p-6 bg-white/10 text-white hover:bg-indigo-500 hover:text-white rounded-[2rem] transition-all hover:scale-110 active:scale-90 shadow-xl" title="Restart Flow">
                <${Lucide.RefreshCw} size=${32} />
            </button>
       </div>
       <div className="flex-1 p-12 md:p-24 space-y-20 overflow-y-auto bg-slate-50/20">
            ${sessionSteps.map((step, i) => html`
                <div key=${i} className="animate-in fade-in slide-in-from-bottom-12 duration-700 w-full max-w-6xl mx-auto">
                    <div className=${`p-14 rounded-[4.5rem] border-4 shadow-2xl leading-relaxed text-2xl ${step.isFinal ? 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-emerald-100' : 'bg-white border-white text-slate-800 shadow-slate-200'}`}>
                        ${step.isFinal && html`
                          <div className="flex items-center gap-4 mb-10 text-emerald-600 font-black text-sm uppercase tracking-[0.5em]">
                            <${Lucide.CheckCircle} size=${32} /> OFFICIAL CX RESOLUTION
                          </div>
                        `}
                        <div className="prose prose-2xl max-w-none text-slate-800 font-bold" dangerouslySetInnerHTML=${{ __html: step.message }} />
                    </div>
                    ${!step.isFinal && step.options?.length > 0 && html`
                        <div className="flex flex-wrap gap-8 mt-16 justify-center">
                            ${step.options.map(opt => html`
                                <button onClick=${() => handleOptionClick(i, opt)} className="px-14 py-6 bg-white border-4 border-slate-100 rounded-[3rem] hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-2xl transition-all font-black text-xl shadow-xl hover:scale-105 active:scale-95">
                                    ${opt.label}
                                </button>
                            `)}
                        </div>
                    `}
                </div>
            `)}
            <div ref=${bottomRef} />
       </div>
       <div className="p-10 bg-white border-t border-slate-100 flex justify-center">
          <p className="text-xs text-slate-300 font-black uppercase tracking-[0.8em]">Cx Solution By Bipul • Excellence in Service</p>
       </div>
    </div>`;
}
