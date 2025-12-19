
import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';
import * as Lucide from 'lucide-react';

const html = htm.bind(React.createElement);

export default function SOPEditor({ initialData, onSave, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'General');
  const [mode, setMode] = useState(initialData?.flowSteps?.length > 0 ? 'FLOW' : 'TEXT');
  const [content, setContent] = useState(initialData?.content || '');
  const [flowSteps, setFlowSteps] = useState(initialData?.flowSteps || [
    { id: 'START', message: 'How can I help you?', options: [], isFinal: false }
  ]);
  
  const textareaRef = useRef(null);

  const insertTag = (tagOpen, tagClose = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    
    let replacement = '';
    if (tagClose) {
      replacement = tagOpen + selected + tagClose;
    } else {
      // For simple insertions like bullets
      replacement = tagOpen;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
    // Focus back and set selection
    setTimeout(() => {
      el.focus();
      const newCursorPos = start + tagOpen.length + selected.length;
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleAddStep = () => {
    const newId = `STEP_${flowSteps.length + 1}`;
    setFlowSteps([...flowSteps, { id: newId, message: '', options: [], isFinal: false }]);
  };

  const handleRemoveStep = (id) => {
    if (id === 'START') return;
    setFlowSteps(flowSteps.filter(s => s.id !== id));
  };

  const updateStep = (id, field, value) => {
    setFlowSteps(flowSteps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAddOption = (stepId) => {
    setFlowSteps(flowSteps.map(s => {
      if (s.id === stepId) {
        return { 
          ...s, 
          options: [...s.options, { label: 'New Option', nextStepId: 'ENDED' }] 
        };
      }
      return s;
    }));
  };

  const updateOption = (stepId, optIdx, field, value) => {
    setFlowSteps(flowSteps.map(s => {
      if (s.id === stepId) {
        const newOpts = [...s.options];
        newOpts[optIdx] = { ...newOpts[optIdx], [field]: value };
        return { ...s, options: newOpts };
      }
      return s;
    }));
  };

  const removeOption = (stepId, optIdx) => {
    setFlowSteps(flowSteps.map(s => {
      if (s.id === stepId) {
        return { ...s, options: s.options.filter((_, i) => i !== optIdx) };
      }
      return s;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || title.replace(/\s+/g, '_'),
      title,
      category,
      content: mode === 'TEXT' ? content : '',
      flowSteps: mode === 'FLOW' ? flowSteps : null,
      tags: [],
      lastUpdated: new Date().toISOString(),
      views: initialData?.views || 0
    });
  };

  return html`
    <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 mb-10">
      <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
            <${Lucide.Edit3} size=${24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">${initialData ? 'Update Disposition' : 'Create New Disposition'}</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Admin Editor Console</p>
          </div>
        </div>
        <button onClick=${onCancel} className="hover:bg-white/10 p-3 rounded-full transition-colors">
          <${Lucide.X} size=${28} />
        </button>
      </div>

      <form onSubmit=${handleSubmit} className="p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Query Title (ID)</label>
            <input required type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-lg" value=${title} onChange=${(e) => setTitle(e.target.value)} placeholder="e.g. Refund_Not_Received" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Category Mapping</label>
            <select className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none bg-white font-bold text-lg" value=${category} onChange=${(e) => setCategory(e.target.value)}>
              <option value="Ordered">Ordered</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Return">Return</option>
              <option value="Exchange">Exchange</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refund">Refund</option>
              <option value="Non Order">Non Order</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Disposition Type</label>
          <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] w-fit">
            <button type="button" onClick=${() => setMode('TEXT')} className=${`px-8 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${mode === 'TEXT' ? 'bg-white shadow-xl text-blue-600 scale-105' : 'text-slate-500 hover:text-slate-700'}`}>
              <${Lucide.FileText} size=${18} /> Standard Solution
            </button>
            <button type="button" onClick=${() => setMode('FLOW')} className=${`px-8 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${mode === 'FLOW' ? 'bg-white shadow-xl text-blue-600 scale-105' : 'text-slate-500 hover:text-slate-700'}`}>
              <${Lucide.GitPullRequest} size=${18} /> Interactive Flow
            </button>
          </div>
        </div>

        ${mode === 'TEXT' ? html`
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Solution Content</label>
                <!-- Formatting Toolbar -->
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                    <button type="button" onClick=${() => insertTag('<b>', '</b>')} className="p-2 hover:bg-white rounded-lg text-slate-700 transition-all" title="Bold">
                        <${Lucide.Bold} size=${18} />
                    </button>
                    <button type="button" onClick=${() => insertTag('<i>', '</i>')} className="p-2 hover:bg-white rounded-lg text-slate-700 transition-all" title="Italic">
                        <${Lucide.Italic} size=${18} />
                    </button>
                    <button type="button" onClick=${() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} className="p-2 hover:bg-white rounded-lg text-slate-700 transition-all" title="Bullet List">
                        <${Lucide.List} size=${18} />
                    </button>
                    <button type="button" onClick=${() => insertTag('<br>', '')} className="p-2 hover:bg-white rounded-lg text-slate-700 transition-all" title="New Line">
                        <${Lucide.CornerDownLeft} size=${18} />
                    </button>
                </div>
            </div>
            <textarea 
                ref=${textareaRef}
                className="w-full h-96 px-8 py-8 bg-slate-50 border-4 border-slate-100 rounded-[2.5rem] focus:border-blue-500 outline-none font-medium text-lg leading-relaxed shadow-inner" 
                value=${content} 
                onChange=${(e) => setContent(e.target.value)} 
                placeholder="Type the solution here. Use the toolbar for formatting..." 
            />
          </div>
        ` : html`
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 text-xl tracking-tight">Interactive Flow Builder</h3>
              <button type="button" onClick=${handleAddStep} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl hover:bg-blue-100 transition-all font-black text-sm border-2 border-blue-100 shadow-sm">
                <${Lucide.Plus} size=${18} /> Add Step
              </button>
            </div>
            
            <div className="space-y-6">
              ${flowSteps.map((step, sIdx) => html`
                <div key=${step.id} className="bg-white border-4 border-slate-50 rounded-[2.5rem] p-8 relative shadow-lg shadow-slate-100 hover:border-blue-50 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-xs font-mono font-black shadow-lg">${step.id}</div>
                      ${step.id === 'START' && html`<span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] bg-emerald-50 px-4 py-1 rounded-full border border-emerald-100">Entry Point</span>`}
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs font-black text-slate-500 cursor-pointer uppercase tracking-widest">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked=${step.isFinal} onChange=${(e) => updateStep(step.id, 'isFinal', e.target.checked)} /> 
                        End of Flow
                      </label>
                      ${step.id !== 'START' && html`
                        <button type="button" onClick=${() => handleRemoveStep(step.id)} className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl transition-all">
                          <${Lucide.Trash2} size=${20} />
                        </button>
                      `}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Bot Prompt / Instruction</label>
                    <textarea rows="2" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-bold focus:border-blue-500 outline-none transition-all shadow-inner" value=${step.message} onChange=${(e) => updateStep(step.id, 'message', e.target.value)} placeholder="What will the agent see in this step?" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Options</label>
                       <button type="button" onClick=${() => handleAddOption(step.id)} className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-[0.2em]">+ Add New Selection</button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        ${step.options.map((opt, oIdx) => html`
                          <div key=${oIdx} className="flex gap-4 items-center bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                            <input type="text" placeholder="Button Label" className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-blue-500 outline-none" value=${opt.label} onChange=${(e) => updateOption(step.id, oIdx, 'label', e.target.value)} />
                            <${Lucide.ArrowRight} size=${16} className="text-slate-300" />
                            <select className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-blue-500 outline-none" value=${opt.nextStepId} onChange=${(e) => updateOption(step.id, oIdx, 'nextStepId', e.target.value)}>
                              <option value="ENDED">Final Resolution</option>
                              ${flowSteps.map(fs => html`<option key=${fs.id} value=${fs.id}>Jump to: ${fs.id}</option>`)}
                            </select>
                            <button type="button" onClick=${() => removeOption(step.id, oIdx)} className="text-slate-300 hover:text-rose-500 p-1">
                              <${Lucide.X} size=${20} />
                            </button>
                          </div>
                        `)}
                    </div>
                  </div>
                </div>
              `)}
            </div>
          </div>
        `}

        <div className="flex justify-end gap-6 pt-10 border-t border-slate-50">
          <button type="button" onClick=${onCancel} className="px-10 py-4 rounded-[1.5rem] border-4 border-slate-50 font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-sm">Discard</button>
          <button type="submit" className="px-14 py-4 rounded-[1.5rem] bg-blue-600 text-white font-black hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center gap-3 uppercase tracking-[0.2em] text-sm">
            <${Lucide.Save} size=${20} />
            Commit to Database
          </button>
        </div>
      </form>
    </div>`;
}
