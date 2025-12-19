
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
      <div className="max-w-7xl mx-auto pt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">SOP Genius</h1>
            <p className="text-slate-500 font-bold text-lg">Central Hub for Customer Support Dispositions</p>
          </div>
          <div className="flex gap-3">
            <input type="file" ref=${fileInputRef} onChange=${handleFileChange} className="hidden" accept=".json" />
            <button onClick=${handleImportClick} className="flex items-center gap-2 bg-white border-2 border-gray-200 px-6 py-3 rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all font-black text-sm shadow-sm group">
              <${Lucide.Upload} size=${20} /> Load Database
            </button>
          </div>
        </div>

        <div className="space-y-8">
           <div className="flex items-center gap-4 text-slate-800 font-black text-xl uppercase tracking-widest">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <${Lucide.Zap} size=${20} />
              </div>
              Most Popular Dispositions
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               ${quickAccessSOPs.map(sop => html`
                   <button key=${sop.id} onClick=${() => onSelectSOP(sop)} className="bg-white p-6 rounded-[2rem] border-2 border-transparent hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all text-left shadow-sm group">
                       <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">${sop.category}</div>
                       <div className="font-bold text-slate-800 text-lg leading-tight mb-4 break-all">${sop.title}</div>
                       <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4 border-t border-gray-50">
                          <span>${sop.views || 0} VISITS</span>
                       </div>
                   </button>
               `)}
           </div>
        </div>
      </div>`;
  }

  return html`
    <!-- Full display chat box -->
    <div className="w-full max-w-[1500px] mx-auto bg-white rounded-[3rem] shadow-2xl border border-gray-200 min-h-[calc(100vh-140px)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
       <div className="p-8 border-b border-gray-100 bg-slate-900 flex justify-between items-center">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
                  <${Lucide.MessageSquare} size=${32} />
               </div>
               <div>
                  <h2 className="font-black text-white leading-tight text-3xl tracking-tight break-all">${selectedSOP?.title}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-xl text-xs font-black uppercase tracking-[0.2em] border border-blue-500/30">${selectedSOP?.category}</span>
                    <span className="text-sm text-slate-500 font-mono tracking-widest uppercase">${selectedSOP?.id}</span>
                  </div>
               </div>
            </div>
            <button onClick=${() => initializeSession(selectedSOP)} className="p-5 bg-white/10 text-white hover:bg-white/20 rounded-3xl transition-all hover:scale-110 active:scale-90" title="Restart Flow">
                <${Lucide.RotateCcw} size=${28} />
            </button>
       </div>
       <div className="flex-1 p-12 md:p-20 space-y-16 overflow-y-auto bg-slate-50/20">
            ${sessionSteps.map((step, i) => html`
                <div key=${i} className="animate-in fade-in slide-in-from-bottom-12 duration-700 w-full max-w-6xl mx-auto">
                    <div className=${`p-12 rounded-[4rem] border-2 shadow-2xl leading-relaxed text-xl ${step.isFinal ? 'bg-green-50 border-green-200 text-green-950 shadow-green-100' : 'bg-white border-white text-slate-800 shadow-slate-200'}`}>
                        ${step.isFinal && html`
                          <div className="flex items-center gap-4 mb-8 text-green-600 font-black text-sm uppercase tracking-[0.4em]">
                            <${Lucide.CheckCircle2} size=${28} /> OFFICIAL RESOLUTION
                          </div>
                        `}
                        <div className="prose prose-2xl max-w-none text-slate-800" dangerouslySetInnerHTML=${{ __html: step.message }} />
                    </div>
                    ${!step.isFinal && step.options?.length > 0 && html`
                        <div className="flex flex-wrap gap-6 mt-12 justify-center">
                            ${step.options.map(opt => html`
                                <button onClick=${() => handleOptionClick(i, opt)} className="px-12 py-5 bg-white border-4 border-slate-100 rounded-[2.5rem] hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 hover:shadow-2xl transition-all font-black text-lg shadow-xl hover:scale-105 active:scale-95">
                                    ${opt.label}
                                </button>
                            `)}
                        </div>
                    `}
                </div>
            `)}
            <div ref=${bottomRef} />
       </div>
       <div className="p-8 bg-white border-t border-gray-100 flex justify-center">
          <p className="text-sm text-slate-300 font-black uppercase tracking-[0.6em]">Accuracy and quality are our top priorities</p>
       </div>
    </div>`;
}
