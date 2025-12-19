import React, { useState, useEffect } from 'react';
import { SOP, CATEGORIES, FlowStep, FlowOption } from '../types';
import { Save, X, Plus, Trash2, ArrowRight, Layers, Type } from 'lucide-react';

interface SOPEditorProps {
  initialData: SOP | null;
  onSave: (sop: SOP) => void;
  onCancel: () => void;
}

const SOPEditor: React.FC<SOPEditorProps> = ({ initialData, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState('');
  
  const [mode, setMode] = useState<'TEXT' | 'FLOW'>('TEXT');
  const [content, setContent] = useState('');
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setTags(initialData.tags.join(', '));
      
      if (initialData.flowSteps && initialData.flowSteps.length > 0) {
          setMode('FLOW');
          setFlowSteps(initialData.flowSteps);
      } else {
          setMode('TEXT');
          setContent(initialData.content);
      }
    } else {
        setFlowSteps([{ id: 'START', message: 'Initial Question...', options: [] }]);
    }
  }, [initialData]);

  const addStep = () => {
      const newId = `STEP_${flowSteps.length + 1}`;
      setFlowSteps([...flowSteps, { id: newId, message: '', options: [] }]);
  };

  const removeStep = (id: string) => {
      setFlowSteps(flowSteps.filter(step => step.id !== id));
  };

  const updateStep = (id: string, field: keyof FlowStep, value: any) => {
      setFlowSteps(flowSteps.map(step => 
          step.id === id ? { ...step, [field]: value } : step
      ));
  };

  const addOption = (stepId: string) => {
      const step = flowSteps.find(s => s.id === stepId);
      if (step) {
          const newOptions = [...step.options, { label: 'New Option', nextStepId: 'ENDED' }];
          updateStep(stepId, 'options', newOptions);
      }
  };

  const removeOption = (stepId: string, optIndex: number) => {
      const step = flowSteps.find(s => s.id === stepId);
      if (step) {
          const newOptions = step.options.filter((_, idx) => idx !== optIndex);
          updateStep(stepId, 'options', newOptions);
      }
  };

  const updateOption = (stepId: string, optIndex: number, field: keyof FlowOption, value: string) => {
      const step = flowSteps.find(s => s.id === stepId);
      if (step) {
          const newOptions = step.options.map((opt, idx) => 
              idx === optIndex ? { ...opt, [field]: value } : opt
          );
          updateStep(stepId, 'options', newOptions);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSOP: SOP = {
      id: initialData ? initialData.id : Date.now().toString(),
      title,
      category,
      content: mode === 'TEXT' ? content : '', 
      flowSteps: mode === 'FLOW' ? flowSteps : undefined,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      lastUpdated: new Date().toISOString(),
      views: initialData ? initialData.views : 0
    };
    onSave(newSOP);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{initialData ? 'Edit SOP' : 'Create New SOP'}</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Refund Policy" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">SOP Format</label>
            <div className="flex gap-4 mb-6">
                <button type="button" onClick={() => setMode('TEXT')} className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${mode === 'TEXT' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <Type size={18} /> <span className="font-medium">Standard Text / Markdown</span>
                </button>
                <button type="button" onClick={() => setMode('FLOW')} className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${mode === 'FLOW' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <Layers size={18} /> <span className="font-medium">Interactive Flow (Chat)</span>
                </button>
            </div>
            
            {mode === 'TEXT' ? (
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                    <textarea required={mode === 'TEXT'} className="w-full h-96 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" value={content} onChange={(e) => setContent(e.target.value)} placeholder="# Heading&#10;**Bold text**&#10;- List item" />
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">Flow Steps</h3>
                        <button type="button" onClick={addStep} className="text-xs flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"><Plus size={14} /> Add Step</button>
                    </div>
                    <div className="space-y-6">
                        {flowSteps.map((step, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded font-mono">ID: <input type="text" value={step.id} onChange={(e) => updateStep(step.id, 'id', e.target.value)} className="bg-transparent border-b border-gray-500 text-white w-24 outline-none focus:border-white" /></div>
                                        {index === 0 && <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">START</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer"><input type="checkbox" checked={step.isFinal || false} onChange={(e) => updateStep(step.id, 'isFinal', e.target.checked)} /> Is Final Solution</label>
                                        {step.id !== 'START' && <button type="button" onClick={() => removeStep(step.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-xs text-gray-500 uppercase font-semibold block mb-1">Bot Message (Supports HTML)</label>
                                    <textarea rows={3} className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" value={step.message} onChange={(e) => updateStep(step.id, 'message', e.target.value)} placeholder="Enter the message the bot will say..." />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs text-gray-500 uppercase font-semibold">User Options / Buttons</label>
                                        <button type="button" onClick={() => addOption(step.id)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">+ Add Option</button>
                                    </div>
                                    <div className="space-y-2">
                                        {step.options.map((opt, optIdx) => (
                                            <div key={optIdx} className="flex items-center gap-2">
                                                <input type="text" placeholder="Button Label" className="flex-1 text-sm px-2 py-1.5 border border-gray-300 rounded focus:border-blue-500 outline-none" value={opt.label} onChange={(e) => updateOption(step.id, optIdx, 'label', e.target.value)} />
                                                <ArrowRight size={14} className="text-gray-400" />
                                                <select className="flex-1 text-sm px-2 py-1.5 border border-gray-300 rounded focus:border-blue-500 outline-none bg-white" value={opt.nextStepId} onChange={(e) => updateOption(step.id, optIdx, 'nextStepId', e.target.value)}>
                                                    <option value="ENDED">End Chat (End)</option>
                                                    {flowSteps.map(s => <option key={s.id} value={s.id}>{s.id} {s.id === step.id ? '(Self)' : ''}</option>)}
                                                </select>
                                                <button type="button" onClick={() => removeOption(step.id, optIdx)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm"><Save size={18} /> Save SOP</button>
        </div>
      </form>
    </div>
  );
};

export default SOPEditor;